"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { formatPrice, tLocal } from "@/lib/utils";
import { BookingModal } from "./BookingModal";

export type HammamCardData = {
  id: string;
  slug: string;
  name: Record<string, string>;
  address: Record<string, string>;
  description: Record<string, string>;
  photos: string[];
  tripadvisorRating: number | null;
  tripadvisorUrl: string | null;
  price: string | number;
  currency: string;
  slots: { id: string; startsAt: string; durationMin: number }[];
};

export function HammamCard({ hammam }: { hammam: HammamCardData }) {
  const t = useTranslations("catalog");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const photo = hammam.photos[0] || "/logo.png";
  const name = tLocal(hammam.name, locale);
  const address = tLocal(hammam.address, locale);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="marble-panel overflow-hidden rounded-3xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover transition duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized={photo.startsWith("http") || photo.startsWith("/uploads")}
          />
        </div>
        <div className="space-y-3 p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="display text-2xl font-semibold text-[var(--stone-deep)]">
              {name}
            </h3>
            {hammam.tripadvisorRating != null && (
              <a
                href={hammam.tripadvisorUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full border border-[var(--line)] bg-[rgba(255,252,247,0.8)] px-3 py-1 text-sm text-[var(--gold-deep)]"
              >
                ★ {hammam.tripadvisorRating.toFixed(1)}
              </a>
            )}
          </div>
          <p className="text-sm text-[var(--stone)]">{address}</p>
          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-sm text-[var(--stone)]">
              {t("from")}{" "}
              <span className="text-base font-semibold text-[var(--stone-deep)]">
                {formatPrice(hammam.price, hammam.currency, locale)}
              </span>
            </p>
            <button
              type="button"
              className="btn-gold !px-4 !py-2 text-sm"
              onClick={() => setOpen(true)}
            >
              {t("book")}
            </button>
          </div>
          {hammam.tripadvisorUrl && (
            <a
              href={hammam.tripadvisorUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs uppercase tracking-[0.12em] text-[var(--gold-deep)]"
            >
              {t("tripadvisor")} ↗
            </a>
          )}
        </div>
      </motion.article>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        hammam={hammam}
      />
    </>
  );
}
