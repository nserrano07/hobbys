// Haversine distance between two [lat, lon] points, in miles.
export function calculateDistance(coords1, coords2) {
  if (!coords1 || !coords2) return null;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function scoreForDistance(distanceMiles) {
  if (distanceMiles == null) return "Unknown";
  if (distanceMiles < 1.5) return "Excellent";
  if (distanceMiles < 3.5) return "Good";
  if (distanceMiles < 5.5) return "Fair";
  return "Poor";
}

export const SCORE_WEIGHT = { Excellent: 3, Good: 2, Fair: 1, Poor: 0, Unknown: 0 };

// Rough as-the-crow-flies estimate. Deliberately labelled "Est." everywhere
// in the UI since it is not based on real routing/transit data.
export function estimateCommute(distanceMiles) {
  if (distanceMiles == null) {
    return { score: "Unknown", label: "Add coordinates to estimate", driveMin: null, walkMin: null };
  }
  const driveMin = Math.max(2, Math.round(distanceMiles * 3 + 2));
  const walkMin = Math.round(distanceMiles * 20);
  const score = scoreForDistance(distanceMiles);
  let label = `${distanceMiles.toFixed(1)} mi (Est. ${driveMin} min drive`;
  if (walkMin <= 50) label += ` / Est. ${walkMin} min walk`;
  label += ")";
  return { score, label, driveMin, walkMin, distanceMiles };
}
