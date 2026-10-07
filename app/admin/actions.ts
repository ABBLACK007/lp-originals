"use server";
// Admin server actions. Every action re-checks the session; the proxy is not relied on.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { SESSION_COOKIE, SESSION_HOURS, adminConfigured, checkPassword, createSession } from "@/lib/admin-auth";
import { isAdmin } from "@/lib/admin-guard";
import { CONTENT_TAG, contentPath, listVersions, readVersion } from "@/lib/content";
import { contentSchema } from "@/lib/content-schema";
import type { Content, Img } from "@/lib/content-types";

const UPLOAD_PREFIX = "uploads/";
const MAX_UPLOAD = 4 * 1024 * 1024; // Vercel functions accept ~4.5MB; the admin shrinks photos before sending.

// ---------- Login ----------
export async function login(_: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  if (!adminConfigured()) return { error: "Admin login isn't set up on the server yet." };
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 900)); // slow down guessing
    return { error: "Wrong password." };
  }
  (await cookies()).set(SESSION_COOKIE, await createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_HOURS * 3600,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Content ----------
const KEEP_VERSIONS = 3; // recent saves kept in storage, in case one needs restoring

const uploadsIn = (c: Content) => new Set([
  ...c.products.flatMap((p) => p.images.map((i) => i.src)),
  ...c.slides.flatMap((s) => [s.image.src, s.mobileImage?.src ?? ""]),
  ...c.gallery.map((g) => g.src.src),
].filter((s) => s.includes(".public.blob.vercel-storage.com/" + UPLOAD_PREFIX)));

export type SaveResult = { ok: true; updatedAt: string } | { ok: false; error: string; issues?: string[] };

export async function saveContent(draft: unknown, baseUpdatedAt: string): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "Your session has ended. Log in again." };
  const parsed = contentSchema.safeParse(draft);
  if (!parsed.success) {
    return { ok: false, error: "Some fields need fixing.", issues: parsed.error.issues.slice(0, 8).map((i) => `${i.path.join(" › ")}: ${i.message}`) };
  }
  // Someone else (another tab or device) saved since this editor loaded: don't overwrite their work.
  const versions = await listVersions();
  const latest = versions[0] ? await readVersion(versions[0]) : null;
  if (latest && latest.updatedAt !== baseUpdatedAt) {
    return { ok: false, error: "The store was changed somewhere else since you opened the editor. Reload the page to get the latest version." };
  }
  const now = Date.now();
  const content = { ...(parsed.data as Content), updatedAt: new Date(now).toISOString() };
  await put(contentPath(now), JSON.stringify(content), {
    access: "public", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 31536000,
  });
  updateTag(CONTENT_TAG); // this admin sees the change straight away
  revalidatePath("/", "layout"); // and every page is rebuilt with it

  // Tidy up: drop old versions, and uploaded photos used only by those.
  try {
    const kept = [content, ...(await Promise.all(versions.slice(0, KEEP_VERSIONS - 1).map(readVersion)))].filter(Boolean) as Content[];
    const dropped = versions.slice(KEEP_VERSIONS - 1);
    const droppedContent = (await Promise.all(dropped.map(readVersion))).filter(Boolean) as Content[];
    const keep = new Set(kept.flatMap((c) => [...uploadsIn(c)]));
    const unused = [...new Set(droppedContent.flatMap((c) => [...uploadsIn(c)]))].filter((u) => !keep.has(u));
    const urls = [...dropped.map((v) => v.url), ...unused];
    if (urls.length) await del(urls);
  } catch (e) {
    console.error("Cleanup after save failed (content was saved)", e);
  }
  return { ok: true, updatedAt: content.updatedAt };
}

// ---------- Uploads ----------
export type UploadResult = { ok: true; img: Img } | { ok: false; error: string };

export async function uploadImage(form: FormData): Promise<UploadResult> {
  if (!(await isAdmin())) return { ok: false, error: "Your session has ended. Log in again." };
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received." };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return { ok: false, error: "Use a JPG, PNG or WebP photo." };
  if (file.size > MAX_UPLOAD) return { ok: false, error: "That photo is too large (max 4MB)." };
  try {
    // Re-encode everything: strips EXIF (incl. GPS location), fixes orientation, caps size.
    const input = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 50_000_000 }).rotate();
    const { data, info } = await input.resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true }).toBuffer({ resolveWithObject: true });
    const blur = await sharp(data).resize(12, 12, { fit: "inside" }).png().toBuffer();
    const blob = await put(`${UPLOAD_PREFIX}${crypto.randomUUID()}.jpg`, data, {
      access: "public", addRandomSuffix: false, contentType: "image/jpeg", cacheControlMaxAge: 31536000,
    });
    return { ok: true, img: { src: blob.url, width: info.width, height: info.height, blurDataURL: `data:image/png;base64,${blur.toString("base64")}` } };
  } catch (e) {
    console.error("Upload failed", e);
    return { ok: false, error: "Couldn't process that photo. Try another one." };
  }
}
