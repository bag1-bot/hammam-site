import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HammamForm } from "@/components/admin/HammamForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { parsePhotos } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { tLocal } from "@/lib/utils";

export default async function EditHammamPage({
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/hammams" className="text-sm text-[var(--gold-deep)]">
            ← Back
          </Link>
          <h1 className="display mt-2 text-4xl">
            {tLocal(hammam.name as Record<string, string>, "en")}
          </h1>
        </div>
        <Link href={`/admin/hammams/${id}/slots`} className="btn-ghost">
          Manage slots
        </Link>
      </div>
      <HammamForm
        hammamId={hammam.id}
        initial={{
          slug: hammam.slug,
          name: hammam.name as never,
          address: hammam.address as never,
          description: hammam.description as never,
          photos: parsePhotos(hammam.photos),
          tripadvisorRating: hammam.tripadvisorRating,
          tripadvisorUrl: hammam.tripadvisorUrl,
          price: Number(hammam.price),
          currency: hammam.currency,
          isPublished: hammam.isPublished,
        }}
      />
    </div>
  );
}
