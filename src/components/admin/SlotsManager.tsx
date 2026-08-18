"use client";

import { FormEvent, useEffect, useState } from "react";

type Slot = {
  id: string;
  startsAt: string;
  durationMin: number;
  isActive: boolean;
};

export function SlotsManager({ hammamId }: { hammamId: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [durationMin, setDurationMin] = useState(30);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSlots() {
    const res = await fetch(`/api/admin/slots?hammamId=${hammamId}`);
    if (res.ok) {
      setSlots(await res.json());
    }
  }

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hammamId]);

  async function onBulkCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "bulk",
        hammamId,
        date,
        startTime,
        endTime,
        durationMin,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Failed to create slots");
      return;
    }
    const data = await res.json();
    setMessage(`Created ${data.created} slots`);
    await loadSlots();
  }

  async function toggleSlot(slot: Slot) {
    await fetch("/api/admin/slots", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slot.id, isActive: !slot.isActive }),
    });
    await loadSlots();
  }

  async function removeSlot(id: string) {
    if (!confirm("Delete slot?")) return;
    await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
    await loadSlots();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onBulkCreate}
        className="marble-panel grid gap-4 rounded-3xl p-6 md:grid-cols-4"
      >
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="field"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Start</label>
          <input
            type="time"
            step={1800}
            className="field"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="label">End</label>
          <input
            type="time"
            step={1800}
            className="field"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Duration (min)</label>
          <input
            type="number"
            min={30}
            step={30}
            className="field"
            required
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-4">
          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? "Creating…" : "Generate slots"}
          </button>
          {message && (
            <p className="mt-3 text-sm text-[var(--gold-deep)]">{message}</p>
          )}
        </div>
      </form>

      <div className="overflow-x-auto marble-panel rounded-3xl">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Starts at</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr
                key={slot.id}
                className="border-b border-[var(--line)] last:border-0"
              >
                <td className="px-4 py-3">
                  {new Date(slot.startsAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{slot.durationMin} min</td>
                <td className="px-4 py-3">{slot.isActive ? "Yes" : "No"}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-[var(--gold-deep)] hover:underline"
                    onClick={() => toggleSlot(slot)}
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    className="text-red-700 hover:underline"
                    onClick={() => removeSlot(slot.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-[var(--stone)]">
                  No slots yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
