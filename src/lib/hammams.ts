import type { HammamCardData } from "@/components/HammamCard";
import { parsePhotos } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

export async function getPublishedHammams(): Promise<HammamCardData[]> {
  try {
    const rows = await prisma.hammam.findMany({
      where: { isPublished: true },
      include: {
        slots: {
          where: {
            isActive: true,
            startsAt: { gte: new Date() },
          },
          orderBy: { startsAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name as Record<string, string>,
      address: row.address as Record<string, string>,
      description: row.description as Record<string, string>,
      photos: parsePhotos(row.photos),
      tripadvisorRating: row.tripadvisorRating,
      tripadvisorUrl: row.tripadvisorUrl,
      price: row.price.toString(),
      currency: row.currency,
      slots: row.slots.map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt.toISOString(),
        durationMin: slot.durationMin,
      })),
    }));
  } catch (error) {
    console.error("[getPublishedHammams]", error);
    return [];
  }
}
