import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { parsePhotos, serializePhotos } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { hammamSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hammam = await prisma.hammam.findUnique({
    where: { id },
    include: {
      slots: { orderBy: { startsAt: "asc" } },
    },
  });

  if (!hammam) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...hammam,
    photos: parsePhotos(hammam.photos),
  });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = hammamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  try {
    const hammam = await prisma.hammam.update({
      where: { id },
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
    return NextResponse.json({
      ...hammam,
      photos: parsePhotos(hammam.photos),
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.hammam.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
