import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SlotsManager } from "@/components/admin/SlotsManager";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tLocal } from "@/lib/utils";

export default async function SlotsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const hammam = await prisma.hammam.findUnique({ where: { id } });
  if (!hammam) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/hammams/${id}`}
          className="text-sm text-[var(--gold-deep)]"
        >
          ← Back to hammam
        </Link>
        <h1 className="display mt-2 text-4xl">
          Slots — {tLocal(hammam.name as Record<string, string>, "en")}
        </h1>
        <p className="mt-2 text-[var(--stone)]">
          Create 30-minute (or longer) availability windows. Slots are not locked
          after a customer request.
        </p>
      </div>
      <SlotsManager hammamId={id} />
    </div>
  );
}
