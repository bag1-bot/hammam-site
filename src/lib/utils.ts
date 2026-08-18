import type { Locale } from "@/i18n/routing";

type Localized = Record<string, string> | null | undefined;

export function tLocal(
  value: Localized,
  locale: Locale | string,
  fallback = ""
): string {
  if (!value || typeof value !== "object") return fallback;
  const record = value as Record<string, string>;
  return (
    record[locale] ||
    record.en ||
    record.ru ||
    Object.values(record)[0] ||
    fallback
  );
}

export function formatPrice(
  amount: number | string,
  currency: string,
  locale: string
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
