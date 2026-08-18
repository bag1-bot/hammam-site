import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.hammam.findFirst({
    where: { slug: "cagaloglu" },
  });
  if (existing) {
    console.log("Seed already applied");
    return;
  }

  const hammam = await prisma.hammam.create({
    data: {
      slug: "cagaloglu",
      name: {
        en: "Cağaloğlu Hamamı",
        ru: "Хамам Джагалоглу",
        zh: "恰加洛卢浴室",
        pt: "Cağaloğlu Hamamı",
      },
      address: {
        en: "Alemdar Cd. No:34, Fatih, Istanbul",
        ru: "Alemdar Cd. No:34, Фатих, Стамбул",
        zh: "伊斯坦布尔法蒂赫 Alemdar Cd. No:34",
        pt: "Alemdar Cd. No:34, Fatih, Istambul",
      },
      description: {
        en: "Historic marble hammam in the Old City.",
        ru: "Исторический мраморный хамам в Старом городе.",
        zh: "老城历史大理石土耳其浴。",
        pt: "Hammam histórico de mármore na Cidade Velha.",
      },
      photos: JSON.stringify(["/logo.png"]),
      tripadvisorRating: 4.5,
      tripadvisorUrl: "https://www.tripadvisor.com/",
      price: 80,
      currency: "EUR",
      isPublished: true,
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const slots = [];
  for (let i = 0; i < 8; i++) {
    const startsAt = new Date(tomorrow.getTime() + i * 30 * 60 * 1000);
    slots.push({
      hammamId: hammam.id,
      startsAt,
      durationMin: 30,
      isActive: true,
    });
  }

  await prisma.slot.createMany({ data: slots });
  console.log("Seeded sample hammam with slots");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
