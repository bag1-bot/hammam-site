import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tLocal } from "@/lib/utils";

export default async function AdminHammamsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const hammams = await prisma.hammam.findMany({
    include: { _count: { select: { slots: true, inquiries: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Hammams</h1>
          <p className="mt-2 text-[var(--stone)]">
            Create and publish hammam listings.
          </p>
        </div>
        <Link href="/admin/hammams/new" className="btn-gold">
          Add hammam
        </Link>
      </div>

      <div className="overflow-x-auto marble-panel rounded-3xl">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Slots</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {hammams.map((h) => (
              <tr key={h.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 font-medium">
                  {tLocal(h.name as Record<string, string>, "en")}
                </td>
                <td className="px-4 py-3">{h.slug}</td>
                <td className="px-4 py-3">
                  {h.price.toString()} {h.currency}
                </td>
                <td className="px-4 py-3">{h._count.slots}</td>
                <td className="px-4 py-3">
                  {h.isPublished ? "Published" : "Draft"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/hammams/${h.id}`}
                    className="text-[var(--gold-deep)] hover:underline"
                  >
                    Edit
                  </Link>
                  {" · "}
                  <Link
                    href={`/admin/hammams/${h.id}/slots`}
                    className="text-[var(--gold-deep)] hover:underline"
                  >
                    Slots
                  </Link>
                </td>
              </tr>
            ))}
            {hammams.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-[var(--stone)]">
                  No hammams yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
