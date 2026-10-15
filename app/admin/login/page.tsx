import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { isAdmin } from "@/lib/admin-guard";
import logoDark from "@/public/images/logo-dark.png";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main id="main" className="flex min-h-[100svh] items-center justify-center bg-mist px-5">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-panel bg-white p-8 shadow-[0_24px_60px_-30px_rgba(20,18,16,0.4)] ring-1 ring-line">
        <Image src={logoDark} alt="LP Wears" className="h-14 w-auto self-start" loading="eager" />
        <div>
          <h1 className="text-[26px] font-semibold">Store admin</h1>
          <p className="text-sm text-muted">Sign in to edit products, prices, photos and settings.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
