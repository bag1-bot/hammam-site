"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="marble-panel w-full max-w-md rounded-3xl p-8"
      >
        <h1 className="display text-4xl">Admin login</h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Enter the admin password to manage hammams and slots.
        </p>
        <div className="mt-6">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-gold mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </form>
    </div>
  );
}
