// An offer is active when oldPrice is higher than price and the end date
// (if any) has not passed.
export function getOffer(product) {
  const { price, oldPrice, offerEndsAt, offerLabel } = product;

  if (price === null || price === undefined) return null;
  if (oldPrice === null || oldPrice === undefined || oldPrice <= price) return null;
  if (offerEndsAt && new Date(`${offerEndsAt}T23:59:59`) < new Date()) return null;

  const savings = oldPrice - price;
  const percent = Math.round((savings / oldPrice) * 100);
  const endsLabel = offerEndsAt
    ? new Date(`${offerEndsAt}T12:00:00`).toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return { oldPrice, savings, percent, label: offerLabel || 'Special offer', endsLabel };
}
