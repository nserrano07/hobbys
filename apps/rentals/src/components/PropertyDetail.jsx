const scoreColor = {
  Excellent: "text-emerald-600",
  Good: "text-blue-600",
  Fair: "text-amber-600",
  Poor: "text-red-500",
  Unknown: "text-slate-400",
};

export default function PropertyDetail({ prop, anchorScores, onClose, onFieldChange, onCopyOutreach, copied }) {
  if (!prop) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center text-slate-500">
        <span className="text-3xl block mb-2">📋</span>
        <p className="font-semibold text-sm">
          Select a listing from the list to update viewing dates, check commute scores, and copy a ready-made inquiry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-5 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-extrabold text-slate-900">{prop.address || "Untitled listing"}</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-0.5">
            {prop.price ? `£${prop.price}/month` : "Price not set"} {prop.agent && <>• {prop.agent}</>}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        {prop.bedrooms != null && <div><b>{prop.bedrooms}</b> bed</div>}
        {prop.bathrooms != null && <div><b>{prop.bathrooms}</b> bath</div>}
        {prop.billsIncluded != null && <div>Bills: <b>{prop.billsIncluded ? "Included" : "Not included"}</b></div>}
        {prop.furnished && <div>{prop.furnished}</div>}
        {prop.deposit != null && <div>Deposit: <b>£{prop.deposit}</b></div>}
        {prop.availableFrom && <div>Available: <b>{prop.availableFrom}</b></div>}
      </div>

      <div className="space-y-3 pt-2">
        <div className="text-xs">
          <span className="block font-bold text-slate-600 uppercase tracking-wide">Viewing Appointment Date:</span>
          <input
            type="date"
            value={prop.viewingDate || ""}
            onChange={(e) => onFieldChange("viewingDate", e.target.value)}
            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs">
          <span className="block font-bold text-slate-600 uppercase tracking-wide">Fast Copy Message Generator:</span>
          <p className="text-slate-500 mb-2 leading-relaxed">
            Click below to copy your inquiry and paste it straight onto OpenRent or Rightmove.
          </p>
          <button
            onClick={onCopyOutreach}
            className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            {copied ? "✓ Copied Outreach Message!" : "📋 Copy Outreach Draft"}
          </button>
        </div>

        {anchorScores.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-1">Distance & Travel Analysis</span>
            <ul className="space-y-2 text-xs text-slate-600">
              {anchorScores.map(({ anchor, commute }) => (
                <li key={anchor.id} className="flex justify-between">
                  <span>{anchor.icon} {anchor.name}:</span>
                  <strong className={scoreColor[commute.score]}>{commute.label}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {prop.description && (
          <div className="border-t border-slate-100 pt-3">
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-1">Pasted Description</span>
            <p className="text-xs text-slate-600 whitespace-pre-wrap max-h-40 overflow-y-auto">{prop.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
