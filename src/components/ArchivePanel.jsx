export default function ArchivePanel({ archived, removalLog, onRestore, onPermanentDelete }) {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
          <span>🗄️</span> Archived Listings ({archived.length})
        </h3>
        {archived.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Nothing archived yet.</p>
        ) : (
          <div className="space-y-3">
            {archived.map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{p.address || "Untitled listing"}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{p.price ? `£${p.price}/mo • ` : ""}Archived {p.archivedAt}</p>
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1 mt-2 inline-block">
                    Reason: {p.archiveReason}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => onRestore(p.id)} className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg">
                    ↺ Restore
                  </button>
                  <button onClick={() => onPermanentDelete(p.id)} className="text-xs font-bold text-red-600 hover:bg-red-50 py-1.5 px-3 rounded-lg">
                    Delete Permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
          <span>📜</span> Removal Log
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          A record of listings you've permanently deleted and why — kept even after the listing itself is gone.
        </p>
        {removalLog.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No permanent deletions yet.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {removalLog.map((entry, i) => (
              <li key={i} className="border-b border-slate-100 pb-2 last:border-0">
                <span className="font-semibold text-slate-700">{entry.address || "Untitled listing"}</span>
                <span className="text-slate-400"> — deleted {entry.deletedAt}</span>
                <p className="text-slate-500">Reason: {entry.reason}{entry.note ? ` — ${entry.note}` : ""}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
