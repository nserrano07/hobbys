// Parses raw text a user copies from a listing page (OpenRent, Rightmove, etc.)
// into structured fields. Runs entirely client-side against the pasted text —
// it never fetches anything, so it only ever surfaces facts the user actually
// gave it.

const ROOM_TYPE_PATTERNS = [
  [/en(-|\s)?suite/i, "Room (En-suite)"],
  [/double room/i, "Room (Double)"],
  [/single room/i, "Room (Single)"],
  [/studio/i, "Studio"],
  [/entire (flat|house|property)/i, "Entire Property"],
  [/house share/i, "House Share"],
  [/room in a shared/i, "House Share"],
];

export function parseListingText(rawText) {
  const text = rawText || "";
  const found = {};
  const missing = [];

  // Price: £850 pcm / £850 per month / £850pm / £195 pw
  const priceMatch = text.match(/£\s?(\d{2,4}(?:\.\d{2})?)\s*(pcm|per\s*month|\/\s*month|pm\b|pw\b|per\s*week|\/\s*week)?/i);
  if (priceMatch) {
    let amount = parseFloat(priceMatch[1]);
    const unit = (priceMatch[2] || "").toLowerCase();
    const isWeekly = /pw|week/.test(unit);
    found.price = isWeekly ? Math.round(amount * 52 / 12) : Math.round(amount);
    found.priceRaw = priceMatch[0].trim();
  } else {
    missing.push("price");
  }

  // Postcode (full or district, e.g. BR5 3QY or BR5)
  const postcodeMatch = text.match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?\b/i);
  if (postcodeMatch) {
    found.postcode = (postcodeMatch[2] ? `${postcodeMatch[1]} ${postcodeMatch[2]}` : postcodeMatch[1]).toUpperCase();
  } else {
    missing.push("postcode");
  }

  // Bedrooms / Bathrooms
  const bedroomMatch = text.match(/(\d+)\s*-?\s*bed(room)?s?\b/i);
  if (bedroomMatch) found.bedrooms = parseInt(bedroomMatch[1], 10);
  else missing.push("bedrooms");

  const bathroomMatch = text.match(/(\d+)\s*-?\s*bath(room)?s?\b/i);
  if (bathroomMatch) found.bathrooms = parseInt(bathroomMatch[1], 10);

  // Bills included
  if (/bills?\s+(are\s+)?included/i.test(text)) {
    found.billsIncluded = true;
  } else if (/bills?\s+(not\s+included|excluded|extra)/i.test(text)) {
    found.billsIncluded = false;
  } else {
    missing.push("billsIncluded");
  }

  // Furnished status
  if (/unfurnished/i.test(text)) found.furnished = "Unfurnished";
  else if (/part\s*furnished/i.test(text)) found.furnished = "Part Furnished";
  else if (/furnished/i.test(text)) found.furnished = "Furnished";
  else missing.push("furnished");

  // Deposit
  const depositMatch = text.match(/deposit[:\s]*£\s?(\d{2,4}(?:\.\d{2})?)/i);
  if (depositMatch) found.deposit = Math.round(parseFloat(depositMatch[1]));
  else missing.push("deposit");

  // Available from
  const availMatch = text.match(/available[:\s]*(from)?\s*[:-]?\s*(now|immediately|asap|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{4})/i);
  if (availMatch) found.availableFrom = availMatch[2];
  else missing.push("availableFrom");

  // Room / property type
  for (const [regex, label] of ROOM_TYPE_PATTERNS) {
    if (regex.test(text)) {
      found.type = label;
      break;
    }
  }
  if (!found.type) missing.push("type");

  // Source site
  if (/openrent/i.test(text)) found.agent = "OpenRent";
  else if (/rightmove/i.test(text)) found.agent = "Rightmove Agent";

  found.description = text.trim();

  return { found, missing };
}
