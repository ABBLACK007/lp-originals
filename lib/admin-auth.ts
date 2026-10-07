// Admin sessions. One password (ADMIN_PASSWORD) unlocks /admin; a successful login sets a signed,
// httpOnly cookie that expires after 12 hours. Signatures use HMAC-SHA256 keyed with ADMIN_SESSION_SECRET
// plus the password itself, so changing the password signs everyone out. Uses Web Crypto only, so the same
// code runs in proxy.ts and in server actions.

export const SESSION_COOKIE = "lp_admin";
export const SESSION_HOURS = 12;

const enc = new TextEncoder();

function config() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  // Refuse to run with missing or weak settings rather than fall back to something guessable.
  const ok = password.length >= 12 && secret.length >= 32;
  return { ok, password, secret };
}

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function hmac(data: string) {
  const { secret, password } = config();
  const key = await crypto.subtle.importKey("raw", enc.encode(`${secret}:${password}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

// Constant-time comparison of two strings of possibly different length (compares their SHA-256 digests).
async function safeEqual(a: string, b: string) {
  const [da, db] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const x = new Uint8Array(da), y = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const adminConfigured = () => config().ok;

export async function checkPassword(input: string) {
  const { ok, password } = config();
  if (!ok) return false;
  return safeEqual(input, password);
}

export async function createSession() {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  return `${exp}.${await hmac(`admin.${exp}`)}`;
}

export async function verifySession(token: string | undefined) {
  if (!token || !config().ok) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(`admin.${exp}`));
}
