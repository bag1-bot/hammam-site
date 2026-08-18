import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tLocal } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const inquiries = await prisma.inquiry.findMany({
    include: { hammam: true, slot: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl">Inquiries</h1>
        <p className="mt-2 text-[var(--stone)]">
          Booking and callback requests (also emailed to blackleon1699@gmail.com).
        </p>
      </div>

      <div className="overflow-x-auto marble-panel rounded-3xl">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Hammam / time</th>
              <th className="px-4 py-3">Locale</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.createdAt.toLocaleString()}
                </td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-[var(--stone)]">{item.phone}</div>
                  {item.email && (
                    <div className="text-[var(--stone)]">{item.email}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {item.hammam
                    ? tLocal(item.hammam.name as Record<string, string>, "en")
                    : "—"}
                  <div className="text-[var(--stone)]">
                    {item.preferredAt
                      ? item.preferredAt.toLocaleString()
                      : item.slot
                        ? item.slot.startsAt.toLocaleString()
                        : "—"}
                  </div>
                  {item.message && (
                    <div className="mt-1 text-[var(--stone)]">{item.message}</div>
                  )}
                </td>
                <td className="px-4 py-3 uppercase">{item.locale}</td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-[var(--stone)]">
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
