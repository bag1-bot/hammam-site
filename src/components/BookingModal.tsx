"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useMemo, useState } from "react";
import { tLocal } from "@/lib/utils";
import type { HammamCardData } from "./HammamCard";

type Props = {
  open: boolean;
  onClose: () => void;
  hammam: HammamCardData;
};

export function BookingModal({ open, onClose, hammam }: Props) {
  const t = useTranslations("booking");
  const common = useTranslations("common");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slotId, setSlotId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const slots = useMemo(
    () =>
      [...hammam.slots].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      ),
    [hammam.slots]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const selected = slots.find((s) => s.id === slotId);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          name,
          phone,
          email: email || undefined,
          hammamId: hammam.id,
          slotId: slotId || undefined,
          preferredAt: selected?.startsAt,
          message: message || undefined,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setSlotId("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={common("close")}
            className="absolute inset-0 bg-[rgba(47,41,36,0.45)]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="marble-panel relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="display text-3xl text-[var(--stone-deep)]">
                  {t("title")}
                </h2>
                <p className="mt-1 text-sm text-[var(--stone)]">
                  {tLocal(hammam.name, locale)} — {t("subtitle")}
                </p>
              </div>
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={onClose}>
                {common("close")}
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="label" htmlFor="bk-name">
                  {t("name")}
                </label>
                <input
                  id="bk-name"
                  className="field"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="bk-phone">
                  {t("phone")}
                </label>
                <input
                  id="bk-phone"
                  className="field"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="bk-email">
                  {t("email")}
                </label>
                <input
                  id="bk-email"
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="bk-slot">
                  {t("slot")}
                </label>
                {slots.length === 0 ? (
                  <p className="text-sm text-[var(--stone)]">{t("noSlots")}</p>
                ) : (
                  <select
                    id="bk-slot"
                    className="field"
                    required
                    value={slotId}
                    onChange={(e) => setSlotId(e.target.value)}
                  >
                    <option value="">—</option>
                    {slots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {new Date(slot.startsAt).toLocaleString(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}{" "}
                        ({slot.durationMin} min)
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="label" htmlFor="bk-message">
                  {t("message")}
                </label>
                <textarea
                  id="bk-message"
                  className="field min-h-24"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={status === "loading" || (slots.length > 0 && !slotId)}
              >
                {status === "loading" ? common("loading") : t("submit")}
              </button>
              {status === "success" && (
                <p className="text-sm text-[var(--gold-deep)]">{t("success")}</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-700">{t("error")}</p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
