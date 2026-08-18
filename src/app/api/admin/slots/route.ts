import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slotBulkSchema, slotSchema } from "@/lib/validators";

function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const hammamId = searchParams.get("hammamId");
  if (!hammamId) {
    return NextResponse.json({ error: "hammamId required" }, { status: 400 });
  }

  const slots = await prisma.slot.findMany({
    where: { hammamId },
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json(slots);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.mode === "bulk") {
    const parsed = slotBulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { hammamId, date, startTime, endTime, durationMin } = parsed.data;
    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);

    if (endMin <= startMin) {
      return NextResponse.json(
        { error: "endTime must be after startTime" },
        { status: 400 }
      );
    }

    if (durationMin % 30 !== 0) {
      return NextResponse.json(
        { error: "durationMin must be multiple of 30" },
        { status: 400 }
      );
    }

    const created = [];
    for (let minute = startMin; minute + durationMin <= endMin; minute += durationMin) {
      const hours = Math.floor(minute / 60)
        .toString()
        .padStart(2, "0");
      const mins = (minute % 60).toString().padStart(2, "0");
      const startsAt = new Date(`${date}T${hours}:${mins}:00`);
      created.push({
        hammamId,
        startsAt,
        durationMin,
        isActive: true,
      });
    }

    const result = await prisma.slot.createMany({ data: created });
    return NextResponse.json({ created: result.count }, { status: 201 });
  }

  const parsed = slotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.durationMin % 30 !== 0) {
    return NextResponse.json(
      { error: "durationMin must be multiple of 30" },
      { status: 400 }
    );
  }

  const slot = await prisma.slot.create({
    data: {
      hammamId: parsed.data.hammamId,
      startsAt: new Date(parsed.data.startsAt),
      durationMin: parsed.data.durationMin,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json(slot, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const slot = await prisma.slot.update({
    where: { id },
    data: {
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      durationMin:
        typeof body.durationMin === "number" ? body.durationMin : undefined,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    },
  });

  return NextResponse.json(slot);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await prisma.slot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
