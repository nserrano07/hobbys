import { STATUSES } from "../lib/demoData";

const scoreColor = {
  Excellent: "text-emerald-600",
  Good: "text-blue-600",
  Fair: "text-amber-600",
  Poor: "text-red-500",
  Unknown: "text-slate-400",
};

export default function PropertyCard({
  prop,
  anchorScores,
  isSelected,
  isIncomplete,
  onSelect,
  onStatusChange,
  onNotesChange,
  onRatingChange,
  onRemoveRequest,
  onCopyOutreach,
  copied,
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${
        isSelected ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200"
      }`}
    >
      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900 text-base">{prop.address || "Untitled listing — add details"}</h4>
            {prop.postcode && (
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase">{prop.postcode}</span>
            )}
            {isIncomplete && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                Needs details
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {prop.type || "Type unknown"} {prop.agent && <>• Managed by <b>{prop.agent}</b></>}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xl font-extrabold text-blue-700">
            {prop.price ? <>£{prop.price}<span className="text-xs text-slate-500 font-normal">/mo</span></> : <span className="text-sm text-slate-400">no price</span>}
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <select
              value={prop.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-bold rounded-full py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 cursor-pointer bg-slate-50 text-slate-700 border-slate-200"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {anchorScores.length > 0 && (
        <div className="px-5 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-100 text-xs">
          {anchorScores.map(({ anchor, commute }) => (
            <div key={anchor.id} className="flex items-center gap-2 justify-between bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500 font-semibold">{anchor.icon} To {anchor.name}:</span>
              <div className="text-right">
                <span className={`font-bold mr-1 ${scoreColor[commute.score]}`}>{commute.score}</span>
                <span className="text-slate-400">{commute.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-white" onClick={(e) => e.stopPropagation()}>
        <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Private Notes</label>
        <textarea
          rows={2}
          value={prop.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add comments here..."
          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-slate-50"
        />
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-500">My Rating:</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => onRatingChange(star)} className="text-lg focus:outline-none transition-transform hover:scale-125">
                {star <= prop.rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center text-xs">
          {prop.link && (
            <a href={prop.link} target="_blank" rel="noreferrer" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all">
              🌐 {prop.agent === "OpenRent" ? "OpenRent Link" : "Listing Link"}
            </a>
          )}
          <button
            onClick={onCopyOutreach}
            className={`font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all ${copied ? "bg-emerald-600 text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-700"}`}
          >
            💬 {copied ? "Copied Letter!" : "Outreach Draft"}
          </button>
          <button onClick={onRemoveRequest} className="text-red-600 hover:text-red-800 font-semibold p-1.5 hover:bg-red-50 rounded" title="Archive or delete">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
