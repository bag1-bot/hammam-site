import { NextResponse } from "next/server";
import {
  bookingMailHtml,
  callbackMailHtml,
  sendMail,
} from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { tLocal } from "@/lib/utils";
import { inquirySchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.type === "callback") {
      await prisma.inquiry.create({
        data: {
          type: "callback",
          name: data.name,
          phone: data.phone,
          locale: data.locale,
        },
      });

      await sendMail({
        subject: "[Aslan] Callback request",
        html: callbackMailHtml(data),
        text: `Callback: ${data.name}, ${data.phone}, locale=${data.locale}`,
      });

      return NextResponse.json({ ok: true });
    }

    const hammam = await prisma.hammam.findUnique({
      where: { id: data.hammamId },
    });

    if (!hammam || !hammam.isPublished) {
      return NextResponse.json({ error: "Hammam not found" }, { status: 404 });
    }

    let preferredAt: Date | null = data.preferredAt
      ? new Date(data.preferredAt)
      : null;
    let slotId: string | null = data.slotId || null;

    if (data.slotId) {
      const slot = await prisma.slot.findFirst({
        where: {
          id: data.slotId,
          hammamId: data.hammamId,
          isActive: true,
        },
      });
      if (!slot) {
        return NextResponse.json({ error: "Slot not found" }, { status: 404 });
      }
      preferredAt = slot.startsAt;
      slotId = slot.id;
    }

    await prisma.inquiry.create({
      data: {
        type: "booking",
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        hammamId: hammam.id,
        slotId,
        preferredAt,
        message: data.message || null,
        locale: data.locale,
      },
    });

    const hammamName = tLocal(
      hammam.name as Record<string, string>,
      data.locale,
      hammam.slug
    );

    await sendMail({
      subject: "[Aslan] New booking request",
      html: bookingMailHtml({
        name: data.name,
        phone: data.phone,
        email: data.email,
        hammamName,
        preferredAt: preferredAt ? preferredAt.toISOString() : null,
        message: data.message,
        locale: data.locale,
      }),
      text: `Booking: ${data.name}, ${data.phone}, hammam=${hammamName}, time=${preferredAt?.toISOString() || "—"}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[inquiries]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
