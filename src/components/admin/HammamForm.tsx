"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Localized = { en: string; ru: string; zh: string; pt: string };

export type HammamFormValues = {
  slug: string;
  name: Localized;
  address: Localized;
  description: Localized;
  photos: string[];
  tripadvisorRating: number | null;
  tripadvisorUrl: string | null;
  price: number;
  currency: string;
  isPublished: boolean;
};

const emptyLocalized = (): Localized => ({ en: "", ru: "", zh: "", pt: "" });

const defaultValues: HammamFormValues = {
  slug: "",
  name: emptyLocalized(),
  address: emptyLocalized(),
  description: emptyLocalized(),
  photos: [],
  tripadvisorRating: null,
  tripadvisorUrl: "",
  price: 50,
  currency: "EUR",
  isPublished: false,
};

export function HammamForm({
  initial,
  hammamId,
}: {
  initial?: Partial<HammamFormValues>;
  hammamId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<HammamFormValues>({
    ...defaultValues,
    ...initial,
    name: { ...emptyLocalized(), ...initial?.name },
    address: { ...emptyLocalized(), ...initial?.address },
    description: { ...emptyLocalized(), ...initial?.description },
    photos: initial?.photos || [],
  });
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setLocalized(
    field: "name" | "address" | "description",
    locale: keyof Localized,
    value: string
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value },
    }));
  }

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error("upload failed");
    const data = await res.json();
    setValues((prev) => ({ ...prev, photos: [...prev.photos, data.url] }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...values,
      tripadvisorUrl: values.tripadvisorUrl || null,
      tripadvisorRating: values.tripadvisorRating,
    };

    const res = await fetch(
      hammamId ? `/api/admin/hammams/${hammamId}` : "/api/admin/hammams",
      {
        method: hammamId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }

    const saved = await res.json();
    router.push(`/admin/hammams/${saved.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!hammamId) return;
    if (!confirm("Delete this hammam?")) return;
    const res = await fetch(`/api/admin/hammams/${hammamId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/hammams");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Slug</label>
          <input
            className="field"
            required
            value={values.slug}
            onChange={(e) =>
              setValues((p) => ({
                ...p,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
              }))
            }
          />
        </div>
        <div>
          <label className="label">Price</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              step="0.01"
              className="field"
              required
              value={values.price}
              onChange={(e) =>
                setValues((p) => ({ ...p, price: Number(e.target.value) }))
              }
            />
            <input
              className="field max-w-24"
              value={values.currency}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  currency: e.target.value.toUpperCase(),
                }))
              }
            />
          </div>
        </div>
      </div>

      {(["name", "address", "description"] as const).map((field) => (
        <div key={field} className="marble-panel rounded-3xl p-5">
          <h3 className="display mb-4 text-2xl capitalize">{field}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {(["en", "ru", "zh", "pt"] as const).map((locale) => (
              <div key={locale}>
                <label className="label">{locale}</label>
                {field === "description" ? (
                  <textarea
                    className="field min-h-24"
                    value={values.description[locale]}
                    onChange={(e) =>
                      setLocalized("description", locale, e.target.value)
                    }
                  />
                ) : (
                  <input
                    className="field"
                    required
                    value={values[field][locale]}
                    onChange={(e) => setLocalized(field, locale, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="marble-panel rounded-3xl p-5">
        <h3 className="display mb-4 text-2xl">TripAdvisor</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Rating (0–5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step="0.1"
              className="field"
              value={values.tripadvisorRating ?? ""}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  tripadvisorRating:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className="label">URL</label>
            <input
              className="field"
              value={values.tripadvisorUrl || ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, tripadvisorUrl: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="marble-panel rounded-3xl p-5">
        <h3 className="display mb-4 text-2xl">Photos</h3>
        <div className="flex flex-wrap gap-2">
          {values.photos.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-24 w-32 rounded-xl object-cover"
              />
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-black/50 px-2 text-xs text-white"
                onClick={() =>
                  setValues((p) => ({
                    ...p,
                    photos: p.photos.filter((item) => item !== url),
                  }))
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            className="field"
            placeholder="https://… or /uploads/…"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              if (!photoUrl.trim()) return;
              setValues((p) => ({
                ...p,
                photos: [...p.photos, photoUrl.trim()],
              }));
              setPhotoUrl("");
            }}
          >
            Add URL
          </button>
          <label className="btn-ghost cursor-pointer">
            Upload file
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await uploadFile(file);
                } catch {
                  setError("Upload failed");
                }
              }}
            />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) =>
            setValues((p) => ({ ...p, isPublished: e.target.checked }))
          }
        />
        Published on website
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-gold" disabled={loading}>
          {loading ? "Saving…" : "Save hammam"}
        </button>
        {hammamId && (
          <button type="button" className="btn-ghost" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
