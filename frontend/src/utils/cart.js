import { availabilityInfo } from './availability';
import { getOffer } from './offers';

// A product can go in the cart only if it has a price and is not sold out.
export function canAddToCart(product) {
  const hasPrice = product.price !== null && product.price !== undefined;
  return hasPrice && !availabilityInfo(product.availability, product.quantity).soldOut;
}

// Most a customer can add: the stock left, or 10 when stock is not tracked.
export function maxQuantity(product) {
  return Number.isFinite(product.quantity) && product.quantity > 0 ? product.quantity : 10;
}

// Turn saved { id, quantity } items into full cart lines using current product data.
export function buildLines(items, products) {
  return items
    .map(({ id, quantity }) => {
      const product = products.find((p) => p.id === id);
      if (!product || !canAddToCart(product)) return null;

      const qty = Math.min(Math.max(1, quantity), maxQuantity(product));
      const offer = getOffer(product);

      return {
        product,
        quantity: qty,
        unitPrice: product.price,
        lineTotal: product.price * qty,
        offer,
        savings: offer ? offer.savings * qty : 0,
      };
    })
    .filter(Boolean);
}

export function summarise(lines) {
  return {
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    savings: lines.reduce((sum, l) => sum + l.savings, 0),
  };
}
