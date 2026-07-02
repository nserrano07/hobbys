import { useState } from "react";
import { parseListingText } from "../lib/smartPaste";
import { createEmptyProperty } from "../lib/demoData";

const emptyForm = () => ({
  address: "",
  postcode: "",
  price: "",
  type: "House Share",
  agent: "",
  link: "",
  bedrooms: "",
  bathrooms: "",
  billsIncluded: "",
  furnished: "",
  deposit: "",
  availableFrom: "",
  notes: "",
  coords: null,
});

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

export default function AddPropertyPanel({ onAdd, onPickLocation, pickingLocation, onClose }) {
  const [tab, setTab] = useState("paste");
  const [pasteText, setPasteText] = useState("");
  const [pasteResult, setPasteResult] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const runSmartPaste = () => {
    const { found, missing } = parseListingText(pasteText);
    setPasteResult({ found, missing });
    setForm((f) => ({
      ...f,
      address: f.address || found.description?.split("\n")[0]?.slice(0, 80) || f.address,
      postcode: found.postcode || f.postcode,
      price: found.price ?? f.price,
      type: found.type || f.type,
      bedrooms: found.bedrooms ?? f.bedrooms,
      bathrooms: found.bathrooms ?? f.bathrooms,
      billsIncluded: found.billsIncluded === true ? "yes" : found.billsIncluded === false ? "no" : f.billsIncluded,
      furnished: found.furnished || f.furnished,
      deposit: found.deposit ?? f.deposit,
      availableFrom: found.availableFrom || f.availableFrom,
      agent: found.agent || f.agent,
      notes: found.description || f.notes,
    }));
    setTab("manual");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.address || !form.price) return;

    const prop = {
      ...createEmptyProperty(),
      address: form.address,
      postcode: form.postcode,
      price: parseInt(form.price, 10),
      type: form.type,
      agent: form.agent,
      link: form.link,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
      billsIncluded: form.billsIncluded === "yes" ? true : form.billsIncluded === "no" ? false : null,
      furnished: form.furnished,
      deposit: form.deposit ? parseInt(form.deposit, 10) : null,
      availableFrom: form.availableFrom,
      notes: form.notes,
      coords: form.coords,
    };
    onAdd(prop);
    setForm(emptyForm());
    setPasteText("");
    setPasteResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-200 p-6 mb-6 animate-fadeIn space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-800">Add a listing</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("paste")}
          className={`px-3 py-2 text-sm font-semibold border-b-2 ${tab === "paste" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500"}`}
        >
          ⚡ Smart Paste
        </button>
        <button
          onClick={() => setTab("manual")}
          className={`px-3 py-2 text-sm font-semibold border-b-2 ${tab === "manual" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500"}`}
        >
          📝 Manual Form
        </button>
      </div>

      {tab === "paste" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Open the listing on OpenRent/Rightmove, select the whole description (address, price, bedrooms, bills,
            deposit, etc.) and paste it below. Nothing is fetched over the network — this only reads the text you paste,
            so every field it fills in is something you actually copied from the real listing.
          </p>
          <textarea
            rows={8}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste the listing text here..."
            className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={runSmartPaste}
            disabled={!pasteText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2 px-4 rounded-lg text-sm"
          >
            Extract details →
          </button>
          {pasteResult && (
            <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="font-bold text-slate-700 mb-1">
                Found {Object.keys(pasteResult.found).length - 1} field(s). Review them in the Manual Form tab below —
                {pasteResult.missing.length > 0 && (
                  <> couldn't detect: {pasteResult.missing.join(", ")}.</>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "manual" && (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Address">
              <input type="text" value={form.address} onChange={set("address")} className={inputCls} required />
            </Field>
            <Field label="Postcode">
              <input type="text" value={form.postcode} onChange={set("postcode")} className={inputCls} />
            </Field>
            <Field label="Monthly Rent (£)">
              <input type="number" value={form.price} onChange={set("price")} className={inputCls} required />
            </Field>
            <Field label="Type">
              <input type="text" value={form.type} onChange={set("type")} className={inputCls} placeholder="e.g. Room (En-suite)" />
            </Field>
            <Field label="Bedrooms">
              <input type="number" value={form.bedrooms} onChange={set("bedrooms")} className={inputCls} />
            </Field>
            <Field label="Bathrooms">
              <input type="number" value={form.bathrooms} onChange={set("bathrooms")} className={inputCls} />
            </Field>
            <Field label="Bills Included">
              <select value={form.billsIncluded} onChange={set("billsIncluded")} className={inputCls}>
                <option value="">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </Field>
            <Field label="Furnished">
              <select value={form.furnished} onChange={set("furnished")} className={inputCls}>
                <option value="">Unknown</option>
                <option value="Furnished">Furnished</option>
                <option value="Part Furnished">Part Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </Field>
            <Field label="Deposit (£)">
              <input type="number" value={form.deposit} onChange={set("deposit")} className={inputCls} />
            </Field>
            <Field label="Available From">
              <input type="text" value={form.availableFrom} onChange={set("availableFrom")} className={inputCls} placeholder="e.g. Now, or 12/08/2026" />
            </Field>
            <Field label="Agent / Landlord">
              <input type="text" value={form.agent} onChange={set("agent")} className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Listing Link (URL)">
                <input type="url" value={form.link} onChange={set("link")} className={inputCls} placeholder="https://www.openrent.co.uk/..." />
              </Field>
            </div>
            <div className="md:col-span-3">
              <Field label="Description / Notes">
                <textarea rows={3} value={form.notes} onChange={set("notes")} className={inputCls} />
              </Field>
            </div>
            <div className="md:col-span-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onPickLocation((coords) => setForm((f) => ({ ...f, coords })))}
                className={`text-sm font-semibold py-2 px-4 rounded-lg border ${
                  pickingLocation ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                📍 {pickingLocation ? "Click the map…" : "Pick location on map"}
              </button>
              {form.coords && (
                <span className="text-xs text-slate-500">
                  {form.coords[0].toFixed(4)}, {form.coords[1].toFixed(4)}
                </span>
              )}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-sm shadow">
            Save to Tracker
          </button>
        </form>
      )}
    </div>
  );
}
