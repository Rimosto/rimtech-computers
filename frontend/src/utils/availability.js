// availability: 'in_stock' | 'out_of_stock' | null
// quantity:     number of units left, or null if not tracked
export function availabilityInfo(availability, quantity) {
  const qty = Number.isFinite(quantity) ? quantity : null;

  if (availability === 'out_of_stock' || qty === 0) {
    return { label: 'Out of stock', tone: 'out', soldOut: true, quantity: 0 };
  }

  if (availability === 'in_stock' || (qty !== null && qty > 0)) {
    if (qty !== null && qty <= 5) {
      return { label: `Only ${qty} left`, tone: 'low', soldOut: false, quantity: qty };
    }
    return { label: 'In stock', tone: 'in', soldOut: false, quantity: qty };
  }

  return { label: 'Check availability', tone: 'unknown', soldOut: false, quantity: null };
}
