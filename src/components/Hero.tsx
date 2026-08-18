"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");
  const brand = useTranslations();

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 75% 25%, rgba(201,162,39,0.18), transparent 30%), linear-gradient(180deg, rgba(47,41,36,0.15), rgba(47,41,36,0.45))",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 80c20-20 40 20 80 0s60 20 80 0' fill='none' stroke='%23c9a227' stroke-opacity='0.25' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <Image
            src="/logo.png"
            alt="Aslan"
            width={120}
            height={120}
            className="mb-6 h-28 w-28 rounded-full object-cover shadow-[0_20px_50px_rgba(143,113,16,0.25)]"
            priority
          />
          <p className="display mb-3 text-5xl font-semibold tracking-[0.14em] text-[var(--stone-deep)] md:text-7xl">
            {brand("brand")}
          </p>
          <div className="gold-rule mb-6 w-40" />
          <h1 className="display max-w-3xl text-3xl font-medium leading-tight text-[var(--stone-deep)] md:text-5xl">
            {t("headline")}
          </h1>
          <p className="mt-5 max-w-xl text-base text-[var(--stone)] md:text-lg">
            {t("sub")}
          </p>
          <Link href="/#catalog" className="btn-gold mt-10">
            {t("cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
