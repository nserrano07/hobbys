import { useState } from "react";

const COLORS = ["#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];
const ICONS = ["📍", "🏛️", "🎾", "🏢", "🏥", "🎓", "🚉", "🛒"];

export default function AnchorManager({ anchors, onAdd, onRemove, onPickLocation, pickingLocation }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [color, setColor] = useState(COLORS[anchors.length % COLORS.length]);
  const [icon, setIcon] = useState(ICONS[anchors.length % ICONS.length]);

  const reset = () => {
    setName("");
    setAddress("");
    setCoords(null);
    setShowForm(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name || !coords) return;
    onAdd({ id: `anchor-${Date.now()}`, name, address, coords, color, icon });
    reset();
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>📍</span> Places You Care About
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg"
        >
          {showForm ? "✕ Cancel" : "✚ Add Place"}
        </button>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Every listing is scored by distance to these anchors — work, gym, family, whatever matters to your search.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {anchors.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-lg border-l-4 bg-slate-50/50 flex justify-between items-start gap-2"
            style={{ borderColor: a.color }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span>{a.icon}</span>
                <h3 className="font-bold text-slate-800">{a.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">{a.address}</p>
            </div>
            <button
              onClick={() => window.confirm(`Remove "${a.name}" from your places?`) && onRemove(a.id)}
              className="text-slate-400 hover:text-red-600 text-sm"
              title="Remove this anchor"
            >
              🗑️
            </button>
          </div>
        ))}
        {anchors.length === 0 && (
          <p className="text-sm text-slate-400 italic md:col-span-2">
            No anchor places yet — add one to start scoring listings by distance.
          </p>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-3 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name (e.g. Work, Mum's house)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Address (for reference)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => onPickLocation((c) => setCoords(c))}
              className={`text-sm font-semibold py-2 px-4 rounded-lg border ${
                pickingLocation ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              📍 {pickingLocation ? "Click the map…" : "Pick location on map"}
            </button>
            {coords && <span className="text-xs text-slate-500">{coords[0].toFixed(4)}, {coords[1].toFixed(4)}</span>}
            <div className="flex gap-1 ml-auto">
              {ICONS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-7 h-7 rounded flex items-center justify-center ${icon === i ? "bg-indigo-100 ring-2 ring-indigo-400" : "bg-slate-100"}`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full ${color === c ? "ring-2 ring-offset-1 ring-slate-500" : ""}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!name || !coords}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            Save Place
          </button>
        </form>
      )}
    </section>
  );
}
