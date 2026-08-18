"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-[var(--marble-cream)] text-[var(--stone-deep)]">
      <div className="border-b border-[var(--line)] bg-[rgba(247,242,234,0.9)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin" className="display text-2xl font-semibold">
              Aslan Admin
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="hover:text-[var(--gold-deep)]">
                Dashboard
              </Link>
              <Link href="/admin/hammams" className="hover:text-[var(--gold-deep)]">
                Hammams
              </Link>
              <Link
                href="/admin/inquiries"
                className="hover:text-[var(--gold-deep)]"
              >
                Inquiries
              </Link>
              <Link href="/en" className="hover:text-[var(--gold-deep)]">
                View site
              </Link>
            </nav>
          </div>
          <button
            type="button"
            className="btn-ghost !px-3 !py-1 text-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
