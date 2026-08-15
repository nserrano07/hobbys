import { useState } from "react";
import { REMOVAL_REASONS } from "../lib/demoData";

export default function RemovalModal({ property, onCancel, onConfirm }) {
  const [reason, setReason] = useState(REMOVAL_REASONS[0]);
  const [note, setNote] = useState("");
  const [mode, setMode] = useState("archive");

  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Remove listing</h3>
          <p className="text-sm text-slate-500 mt-1">
            {property.address || "This listing"} — please record why before it leaves your active list.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {REMOVAL_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Note (optional)</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any extra detail for your own records..."
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 text-sm">
          <label className={`flex-1 border rounded-lg p-3 cursor-pointer ${mode === "archive" ? "border-indigo-500 bg-indigo-50" : "border-slate-200"}`}>
            <input type="radio" name="mode" value="archive" checked={mode === "archive"} onChange={() => setMode("archive")} className="mr-2" />
            <span className="font-semibold">Archive</span>
            <p className="text-xs text-slate-500 mt-1">Keep it, hidden from the active list. Restorable anytime.</p>
          </label>
          <label className={`flex-1 border rounded-lg p-3 cursor-pointer ${mode === "delete" ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
            <input type="radio" name="mode" value="delete" checked={mode === "delete"} onChange={() => setMode("delete")} className="mr-2" />
            <span className="font-semibold">Delete permanently</span>
            <p className="text-xs text-slate-500 mt-1">Removes it entirely. Reason stays in your removal log.</p>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(mode, reason, note)}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg ${mode === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {mode === "delete" ? "Delete Permanently" : "Archive Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
