"use client";
import { usePathname } from "next/navigation";
import TabBar from "./TabBar";

// The store is a phone app on every screen (owner's mockup): one 430px column, centred on a grey canvas on
// wider screens, with the tab bar fixed to its bottom. The admin keeps the full browser width.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return <>{children}</>;
  return (
    <div className="min-h-[100svh] bg-canvas">
      <div className="relative mx-auto min-h-[100svh] w-full max-w-app bg-paper pb-[calc(88px+env(safe-area-inset-bottom))] sm:shadow-[0_0_80px_-20px_rgba(17,17,17,0.25)] print:max-w-none print:pb-0 print:shadow-none">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
