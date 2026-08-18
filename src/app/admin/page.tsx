import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [hammams, inquiries, slots] = await Promise.all([
    prisma.hammam.count(),
    prisma.inquiry.count(),
    prisma.slot.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-4xl">Dashboard</h1>
        <p className="mt-2 text-[var(--stone)]">
          Manage hammams, booking slots, and incoming requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Hammams" value={hammams} href="/admin/hammams" />
        <Stat label="Slots" value={slots} href="/admin/hammams" />
        <Stat label="Inquiries" value={inquiries} href="/admin/inquiries" />
      </div>

      <Link href="/admin/hammams/new" className="btn-gold inline-flex">
        Add hammam
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="marble-panel rounded-3xl p-6 transition hover:-translate-y-0.5">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--stone)]">
        {label}
      </p>
      <p className="display mt-2 text-4xl">{value}</p>
    </Link>
  );
}
