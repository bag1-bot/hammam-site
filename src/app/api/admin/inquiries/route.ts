import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    include: {
      hammam: true,
      slot: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(inquiries);
}
