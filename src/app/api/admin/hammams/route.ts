import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { parsePhotos, serializePhotos } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { hammamSchema } from "@/lib/validators";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hammams = await prisma.hammam.findMany({
    include: { _count: { select: { slots: true, inquiries: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    hammams.map((h) => ({ ...h, photos: parsePhotos(h.photos) }))
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = hammamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const hammam = await prisma.hammam.create({
    data: {
      slug: data.slug,
      name: data.name,
      address: data.address,
      description: data.description,
      photos: serializePhotos(data.photos),
      tripadvisorRating: data.tripadvisorRating ?? null,
      tripadvisorUrl: data.tripadvisorUrl || null,
      price: data.price,
      currency: data.currency,
      isPublished: data.isPublished,
    },
  });

  return NextResponse.json(
    { ...hammam, photos: parsePhotos(hammam.photos) },
    { status: 201 }
  );
}
