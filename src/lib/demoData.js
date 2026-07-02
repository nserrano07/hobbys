// Demo dataset shown to first-time visitors, based on Natalia's real Orpington/
// Bromley house-share search. The 5 OpenRent listings below are real links —
// but since this tool can't reach the network to scrape them, only the link
// and ID are pre-filled. Everything else is intentionally left blank so it's
// never mistaken for fetched fact; use "Smart Paste" (paste the listing's own
// text) or the manual form to fill each one in with real details.

export const DEMO_ANCHORS = [
  {
    id: "anchor-kennedy-house",
    name: "Kennedy House",
    address: "Murray Road, Orpington, BR5 3QY",
    coords: [51.3879, 0.1147],
    color: "#EF4444",
    icon: "🏛️",
  },
  {
    id: "anchor-tennis-centre",
    name: "Bromley Tennis Centre",
    address: "Avebury Rd, Orpington, BR6 9SA",
    coords: [51.3575, 0.0911],
    color: "#10B981",
    icon: "🎾",
  },
];

const skeletonListing = (id, link) => ({
  id,
  link,
  agent: "OpenRent",
  address: "",
  postcode: "",
  price: null,
  type: "",
  bedrooms: null,
  bathrooms: null,
  billsIncluded: null,
  furnished: "",
  deposit: null,
  availableFrom: "",
  description: "",
  notes: "Paste the listing's details using Smart Paste, or fill in the form manually.",
  coords: null,
  status: "Not Contacted",
  rating: 0,
  viewingDate: "",
  isArchived: false,
  archiveReason: "",
  archivedAt: "",
  createdAt: new Date().toISOString(),
});

// Real facts as pasted from each OpenRent listing page (this app cannot reach
// the network to fetch them itself). Coordinates are left blank — use "Pick
// location on map" in the Anchors/Add Listing forms to place them precisely,
// rather than guessing.
const realListing = (base) => ({
  ...skeletonListing(base.id, base.link),
  ...base,
  notes: base.notes || "",
});

export const DEMO_PROPERTIES = [
  realListing({
    id: "openrent-2118389",
    link: "https://www.openrent.co.uk/2118389",
    address: "Southwood Road, SE9, London",
    postcode: "SE9",
    price: 710,
    type: "Room (Single, House Share)",
    agent: "Xpert",
    status: "Contacted",
    bedrooms: 4,
    bathrooms: 2,
    billsIncluded: null,
    furnished: "Furnished",
    deposit: 710,
    availableFrom: "02 July 2026",
    description:
      "Room in a Shared House, Southwood Road, SE9. 4 bedrooms, 2 bathrooms. Delightful room in a 4 bed, 2 bath shared house. Available to move in from 02 July 2026. Parking available, garden access. Furnished. Room 1 - Single room for 1 person - £710/month (£163.85/week). Deposit from £710. Live-in landlord. Minimum tenancy 6 months. Max 1 tenant per room. 3 rooms already let. EPC Not Required (Shared Accommodation).",
    notes:
      "Live-in landlord, min. 6 month tenancy, 3 of 4 rooms already let. \"Bills Included\" field was blank on the listing (not explicitly confirmed either way) — ask before applying. Viewing requested via OpenRent (contact: Xpert).",
  }),
  realListing({
    id: "openrent-2903217",
    link: "https://www.openrent.co.uk/2903217",
    address: "Star Lane, BR5, Orpington",
    postcode: "BR5",
    price: 1099,
    type: "Studio Flat",
    agent: "Francis",
    status: "Contacted",
    bedrooms: 1,
    bathrooms: 1,
    billsIncluded: true,
    furnished: "Furnished",
    deposit: 1099,
    availableFrom: "Today",
    description:
      "Studio Flat, Star Lane, BR5. 1 bedroom, 1 bathroom, 1 tenant max. Fully furnished self-contained studios. Communal kitchen with 2 cookers & 2 ovens. Recently renovated. All bills inclusive. Free wifi. Use of large garden. Free parking on the drive & nearby road. 10-15 min walk to nearest train station. 5 min walk to major shopping outlets. Other occupants are all professionals. Referencing required. EPC Rating D. Preferred minimum tenancy 3 months.",
    notes: "All bills inclusive per listing description. Recently renovated. EPC rating D. Viewing requested via OpenRent (contact: Francis). Note: there's a second, separate Star Lane studio below (contact: Premium Homes) — different unit, don't confuse the two.",
  }),
  realListing({
    id: "openrent-2927278",
    link: "https://www.openrent.co.uk/2927278",
    address: "Gardiner Close, BR5, Orpington",
    postcode: "BR5",
    price: 1050,
    type: "Studio Flat",
    agent: "Hampshire Heights Ltd",
    status: "Contacted",
    bedrooms: 1,
    bathrooms: 1,
    billsIncluded: null,
    furnished: "At tenant's choice (furnished or unfurnished)",
    deposit: 1050,
    availableFrom: "26 May 2026",
    description:
      "Studio Flat, Gardiner Close, BR5. 1 bedroom, 1 bathroom, 1 tenant max. £1,050/month (£242.31/week). Deposit £1,050. Available to move in from 26 May 2026 (photos to follow shortly). Furnished or unfurnished, tenant's choice. Preferred minimum tenancy 12 months. EPC Rating C.",
    notes: "Photos weren't up yet per listing. Longer preferred minimum tenancy (12 months) than the other two. Viewing requested via OpenRent (contact: Hampshire Heights Ltd).",
  }),
  realListing({
    id: "openrent-2952182",
    link: "https://www.openrent.co.uk/2952182",
    address: "Edenbridge Close, BR5, Orpington",
    postcode: "BR5",
    price: 800,
    type: "Room (Double, House Share)",
    agent: "Savio",
    status: "Contacted",
    bedrooms: 3,
    bathrooms: 1,
    billsIncluded: true,
    furnished: "Furnished",
    deposit: 500,
    availableFrom: "Today",
    description:
      "Room in a Shared House, Edenbridge Close, BR5. 3 bedrooms, 1 bathroom. A bright and spacious double bedroom in a well-kept house. All bills included. Furnished with a double bed, 2 big wardrobes, chest of drawers, bedside table. Ideal for a working professional or mature student. 12-15 min walk to St Mary Cray station, 8 min walk to Nugent shopping centre (M&S, Lidl, Aldi). Sharing with 2 other flatmates. Monthly rent £800, deposit £500. 2 rooms already let. Minimum tenancy 6 months. EPC Not Required (Shared Accommodation).",
    notes: "All bills included (explicitly stated in description). 2 of 3 rooms already let. Good transport links — close to St Mary Cray station and Nugent shopping centre. Viewing requested via OpenRent (contact: Savio).",
  }),
  realListing({
    id: "openrent-2932173",
    link: "https://www.openrent.co.uk/2932173",
    address: "Star Lane, BR5, Orpington",
    postcode: "BR5",
    price: 1100,
    type: "Studio Flat",
    agent: "Premium Homes",
    status: "Contacted",
    bedrooms: 1,
    bathrooms: 1,
    billsIncluded: null,
    furnished: "Furnished",
    deposit: 1100,
    availableFrom: "13 June 2026",
    description:
      "Studio Flat, Star Lane, BR5. 1 bedroom, 1 bathroom, 2 tenants max. Delightful 1 bedroom, 1 bathroom studio flat in a great location. Photos to follow shortly. Available to move in from 13 June 2026. Furnished. Rent £1,100/month (£253.85/week). Deposit £1,100. EPC Rating D.",
    notes: "Separate listing/unit from the other Star Lane studio above (contact: Francis) — same street, different landlord (Premium Homes), different price and 2-tenant max vs 1. Viewing requested via OpenRent.",
  }),
  realListing({
    id: "openrent-cray-valley-road",
    link: "",
    address: "Cray Valley Road, BR5, Orpington",
    postcode: "BR5",
    type: "2 Bed End Terrace",
    agent: "Metropolitan",
    status: "Contacted",
    notes: "Seen in the OpenRent messages dashboard (contact: Metropolitan) — full listing text hasn't been pasted in yet. Use Smart Paste once you have the listing page open, and add its direct openrent.co.uk link here.",
  }),
];

export const STATUSES = [
  "Not Contacted",
  "Contacted",
  "Viewing Scheduled",
  "Offer Made",
  "Rejected",
];

export const REMOVAL_REASONS = [
  "Property already let / no longer available",
  "Rent too high for budget",
  "Location / commute doesn't work",
  "Landlord or agent unresponsive",
  "Viewing didn't go well",
  "Found somewhere else",
  "Added by mistake",
  "Other",
];

export function isPropertyIncomplete(prop) {
  return !prop.address || !prop.price || !prop.coords;
}

export function createEmptyProperty() {
  return skeletonListing(`prop-${Date.now()}`, "");
}
