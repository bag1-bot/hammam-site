"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CallbackModal({ open, onClose }: Props) {
  const t = useTranslations("callback");
  const common = useTranslations("common");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
          name,
          phone,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setName("");
      setPhone("");
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
            className="marble-panel relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="display text-3xl text-[var(--stone-deep)]">
                  {t("title")}
                </h2>
                <p className="mt-1 text-sm text-[var(--stone)]">{t("subtitle")}</p>
              </div>
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={onClose}>
                {common("close")}
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="label" htmlFor="cb-name">
                  {t("name")}
                </label>
                <input
                  id="cb-name"
                  className="field"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="cb-phone">
                  {t("phone")}
                </label>
                <input
                  id="cb-phone"
                  className="field"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={status === "loading"}
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
