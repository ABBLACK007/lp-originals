import type { Metadata } from "next";
import AdminEditor from "@/components/admin/AdminEditor";
import { requireAdmin } from "@/lib/admin-guard";
import { getFreshContent } from "@/lib/content";

export const metadata: Metadata = { title: "Store admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic"; // always the latest saved content

export default async function AdminPage() {
  await requireAdmin();
  return <AdminEditor initial={await getFreshContent()} />;
}
