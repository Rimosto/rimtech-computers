// Accepts 0712345678, 0112345678, +254712345678, 254712345678 (spaces and dashes allowed).
// Returns the number as +254XXXXXXXXX, or null when it is not a valid Kenyan mobile number.
export function normaliseKenyanPhone(input) {
  const cleaned = String(input || '').replace(/[\s()-]/g, '');
  const match = cleaned.match(/^(?:\+?254|0)([17]\d{8})$/);
  return match ? `+254${match[1]}` : null;
}
