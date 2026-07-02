import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "./components/MapView";
import AnchorManager from "./components/AnchorManager";
import AddPropertyPanel from "./components/AddPropertyPanel";
import PropertyCard from "./components/PropertyCard";
import PropertyDetail from "./components/PropertyDetail";
import RemovalModal from "./components/RemovalModal";
import ArchivePanel from "./components/ArchivePanel";
import { DEMO_ANCHORS, DEMO_PROPERTIES, STATUSES, isPropertyIncomplete } from "./lib/demoData";
import { calculateDistance, estimateCommute, SCORE_WEIGHT } from "./lib/geo";

const STORAGE_KEY = "rental_tracker_data_v1";

function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        anchors: parsed.anchors ?? [],
        properties: parsed.properties ?? [],
        removalLog: parsed.removalLog ?? [],
        isDemo: !!parsed.isDemo,
      };
    } catch {
      // fall through to demo
    }
  }
  return { anchors: DEMO_ANCHORS, properties: DEMO_PROPERTIES, removalLog: [], isDemo: true };
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [{ anchors, properties, removalLog, isDemo }, setData] = useState(loadInitialState);
  const [selectedId, setSelectedId] = useState(null);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [statusFilter, setStatusFilter] = useState("All");
  const [proximityFilter, setProximityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [view, setView] = useState("active"); // active | archived
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [pickingLocation, setPickingLocation] = useState(false);
  const [focusSignal, setFocusSignal] = useState(null);
  const [removalTarget, setRemovalTarget] = useState(null);

  const pickCallbackRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ anchors, properties, removalLog, isDemo }));
  }, [anchors, properties, removalLog, isDemo]);

  const requestLocationPick = (callback) => {
    pickCallbackRef.current = callback;
    setPickingLocation(true);
  };

  const handleMapPick = (coords) => {
    pickCallbackRef.current?.(coords);
    pickCallbackRef.current = null;
    setPickingLocation(false);
  };

  const setProperties = (updater) =>
    setData((d) => ({ ...d, properties: typeof updater === "function" ? updater(d.properties) : updater }));

  const setAnchors = (updater) =>
    setData((d) => ({ ...d, anchors: typeof updater === "function" ? updater(d.anchors) : updater }));

  const anchorScoresFor = (prop) =>
    anchors.map((anchor) => ({
      anchor,
      commute: estimateCommute(calculateDistance(prop.coords, anchor.coords)),
    }));

  const bestScoreWeight = (prop) => {
    const scores = anchorScoresFor(prop);
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((s) => SCORE_WEIGHT[s.commute.score]));
  };

  const worstScoreWeight = (prop) => {
    const scores = anchorScoresFor(prop);
    if (scores.length === 0) return 0;
    return Math.min(...scores.map((s) => SCORE_WEIGHT[s.commute.score]));
  };

  const activeProperties = properties.filter((p) => !p.isArchived);
  const archivedProperties = properties.filter((p) => p.isArchived);

  const filteredProperties = useMemo(() => {
    return activeProperties
      .filter((prop) => {
        if (prop.price && prop.price > maxPrice) return false;
        if (statusFilter !== "All" && prop.status !== statusFilter) return false;
        if (proximityFilter === "Excellent Only" && bestScoreWeight(prop) < SCORE_WEIGHT.Excellent) return false;
        if (proximityFilter === "Good or Better" && worstScoreWeight(prop) === 0 && bestScoreWeight(prop) < SCORE_WEIGHT.Good) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price-low") return (a.price || Infinity) - (b.price || Infinity);
        if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortBy === "proximity") {
          const totalA = anchorScoresFor(a).reduce((sum, s) => sum + SCORE_WEIGHT[s.commute.score], 0);
          const totalB = anchorScoresFor(b).reduce((sum, s) => sum + SCORE_WEIGHT[s.commute.score], 0);
          return totalB - totalA;
        }
        return 0;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProperties, maxPrice, statusFilter, proximityFilter, sortBy, anchors]);

  const selectedProperty = properties.find((p) => p.id === selectedId) || null;

  const updateProperty = (id, patch) =>
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addProperty = (prop) => {
    setProperties((prev) => [prop, ...prev]);
    setSelectedId(prop.id);
    setShowAddForm(false);
    if (prop.coords) setFocusSignal({ coords: prop.coords, zoom: 14, id: prop.id });
  };

  const addAnchor = (anchor) => setAnchors((prev) => [...prev, anchor]);
  const removeAnchor = (id) => setAnchors((prev) => prev.filter((a) => a.id !== id));

  const confirmRemoval = (mode, reason, note) => {
    const prop = removalTarget;
    if (!prop) return;
    if (mode === "archive") {
      updateProperty(prop.id, { isArchived: true, archiveReason: reason, archivedAt: todayISO() });
    } else {
      setData((d) => ({
        ...d,
        properties: d.properties.filter((p) => p.id !== prop.id),
        removalLog: [{ address: prop.address, reason, note, deletedAt: todayISO() }, ...d.removalLog],
      }));
    }
    if (selectedId === prop.id) setSelectedId(null);
    setRemovalTarget(null);
  };

  const restoreProperty = (id) => updateProperty(id, { isArchived: false, archiveReason: "", archivedAt: "" });
  const permanentlyDeleteArchived = (id) => {
    const prop = properties.find((p) => p.id === id);
    if (!window.confirm("Permanently delete this archived listing? This cannot be undone.")) return;
    setData((d) => ({
      ...d,
      properties: d.properties.filter((p) => p.id !== id),
      removalLog: [
        { address: prop?.address, reason: prop?.archiveReason || "Deleted from archive", deletedAt: todayISO() },
        ...d.removalLog,
      ],
    }));
  };

  const clearSession = () => {
    if (!window.confirm("Clear all data and start fresh? This removes every listing, place, and log from this browser.")) return;
    setData({ anchors: [], properties: [], removalLog: [], isDemo: false });
    setSelectedId(null);
  };

  const loadDemo = () => {
    if (!window.confirm("Load the demo Orpington/Bromley dataset? This replaces your current data.")) return;
    setData({ anchors: DEMO_ANCHORS, properties: DEMO_PROPERTIES, removalLog: [], isDemo: true });
    setSelectedId(null);
  };

  const dismissDemoBanner = () => setData((d) => ({ ...d, isDemo: false }));

  const copyOutreach = (prop) => {
    const greeting = prop.agent === "OpenRent" ? "Hi Landlord," : `Dear ${prop.agent || "Agent"},`;
    const msg = `${greeting}

I hope you are well. I am highly interested in your listing at ${prop.address || "your property"}${
      prop.link ? ` (${prop.link})` : ""
    }${prop.price ? `, advertised at £${prop.price}/month` : ""}.

Could you please let me know:
1. Is this still available?
2. When are the next available slots for a viewing?
3. Could you confirm parking/transport accessibility nearby?

I have my references and deposit ready to proceed. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Phone Number]`;

    navigator.clipboard
      .writeText(msg)
      .then(() => {
        setCopiedId(prop.id);
        setTimeout(() => setCopiedId(null), 3000);
      })
      .catch((err) => console.error("Could not copy outreach text: ", err));
  };

  const focusOnMap = (prop) => {
    if (prop.coords) setFocusSignal({ coords: prop.coords, zoom: 14, id: prop.id });
    setSelectedId(prop.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏠</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Rental Tracker</h1>
              <p className="text-blue-100 text-xs font-medium">Compare listings by distance to the places that matter to you</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowAddForm((s) => !s)}
              className="bg-white hover:bg-slate-100 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow text-sm transition-all duration-200"
            >
              {showAddForm ? "✕ Close Form" : "✚ Add Listing"}
            </button>
            <button onClick={loadDemo} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors" title="Load demo data">
              🔄 Demo Data
            </button>
            <button onClick={clearSession} className="bg-red-600/90 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors" title="Wipe all data in this browser">
              🧹 Clear Session
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
            <span>
              <b>You're viewing demo data</b> — a real Orpington/Bromley search, but the 5 OpenRent listings only have
              real links (this app can't fetch pages itself). Use <b>Smart Paste</b> on a listing to fill in its real details.
            </span>
            <div className="flex gap-2 shrink-0">
              <button onClick={dismissDemoBanner} className="text-xs font-bold bg-white border border-amber-300 py-1.5 px-3 rounded-lg hover:bg-amber-100">
                Dismiss
              </button>
              <button onClick={clearSession} className="text-xs font-bold bg-amber-600 text-white py-1.5 px-3 rounded-lg hover:bg-amber-700">
                Start My Own Tracker
              </button>
            </div>
          </div>
        )}

        <AnchorManager anchors={anchors} onAdd={addAnchor} onRemove={removeAnchor} onPickLocation={requestLocationPick} pickingLocation={pickingLocation} />

        {showAddForm && (
          <AddPropertyPanel onAdd={addProperty} onPickLocation={requestLocationPick} pickingLocation={pickingLocation} onClose={() => setShowAddForm(false)} />
        )}

        <section className="bg-slate-800 text-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Max Monthly Budget (£{maxPrice})</label>
            <input
              type="range"
              min="300"
              max="2000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>£300</span>
              <span className="text-blue-400 font-bold">Max: £{maxPrice}</span>
              <span>£2000</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Proximity Score Filter</label>
            <select value={proximityFilter} onChange={(e) => setProximityFilter(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="All">Any Proximity</option>
              <option value="Excellent Only">Excellent Only</option>
              <option value="Good or Better">Good or Better</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sort Listings By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="rating">My Rating (High to Low)</option>
              <option value="price-low">Rent (Low to High)</option>
              <option value="price-high">Rent (High to Low)</option>
              <option value="proximity">Best Combined Proximity</option>
            </select>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setView("active")}
                  className={`font-bold text-sm px-3 py-1.5 rounded-lg ${view === "active" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
                >
                  📋 Active ({filteredProperties.length})
                </button>
                <button
                  onClick={() => setView("archived")}
                  className={`font-bold text-sm px-3 py-1.5 rounded-lg ${view === "archived" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
                >
                  🗄️ Archived ({archivedProperties.length})
                </button>
              </div>
            </div>

            {view === "archived" ? (
              <ArchivePanel archived={archivedProperties} removalLog={removalLog} onRestore={restoreProperty} onPermanentDelete={permanentlyDeleteArchived} />
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
                <span className="text-4xl">🔍</span>
                <p className="font-medium text-slate-600 mt-2">No listings match your filters, or you haven't added any yet.</p>
                <button
                  onClick={() => { setMaxPrice(2000); setStatusFilter("All"); setProximityFilter("All"); }}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  prop={prop}
                  anchorScores={anchorScoresFor(prop)}
                  isSelected={selectedId === prop.id}
                  isIncomplete={isPropertyIncomplete(prop)}
                  onSelect={() => focusOnMap(prop)}
                  onStatusChange={(v) => updateProperty(prop.id, { status: v })}
                  onNotesChange={(v) => updateProperty(prop.id, { notes: v })}
                  onRatingChange={(v) => updateProperty(prop.id, { rating: v })}
                  onRemoveRequest={() => setRemovalTarget(prop)}
                  onCopyOutreach={() => copyOutreach(prop)}
                  copied={copiedId === prop.id}
                />
              ))
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="text-indigo-600 animate-pulse">⬤</span> Live Map
                </span>
                <span className="text-xs text-slate-500 font-semibold">Interactive</span>
              </div>
              <MapView
                anchors={anchors}
                properties={properties}
                onSelectProperty={(p) => setSelectedId(p.id)}
                pickingLocation={pickingLocation}
                onPickLocation={handleMapPick}
                focusSignal={focusSignal}
              />
            </div>

            <PropertyDetail
              prop={selectedProperty}
              anchorScores={selectedProperty ? anchorScoresFor(selectedProperty) : []}
              onClose={() => setSelectedId(null)}
              onFieldChange={(field, value) => updateProperty(selectedProperty.id, { [field]: value })}
              onCopyOutreach={() => copyOutreach(selectedProperty)}
              copied={selectedProperty && copiedId === selectedProperty.id}
            />
          </div>
        </div>
      </main>

      <RemovalModal property={removalTarget} onCancel={() => setRemovalTarget(null)} onConfirm={confirmRemoval} />

      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-12 border-t border-slate-800 text-xs">
        <p>Rental Tracker — a portfolio project by Natalia Serrano Ortiz.</p>
        <p className="mt-1 text-slate-600">All data stays in your browser via localStorage — nothing is sent to a server.</p>
      </footer>
    </div>
  );
}
