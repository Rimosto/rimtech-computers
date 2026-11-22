import { formatKsh } from './format';
import { getOffer } from './offers';

const NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function whatsappLink(message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${NUMBER}${text}`;
}

export function productEnquiryLink(product) {
  const lines = [`Hello RimTech, I'm interested in the ${product.name}.`];

  if (product.model && !product.name.toLowerCase().includes(product.model.toLowerCase())) {
    lines.push(`Model: ${product.model}`);
  }

  if (product.price !== null && product.price !== undefined) {
    const offer = getOffer(product);
    lines.push(
      offer
        ? `Offer price: ${formatKsh(product.price)} (was ${formatKsh(offer.oldPrice)})`
        : `Listed price: ${formatKsh(product.price)}`
    );
  }

  if (product.freeGifts && product.freeGifts.length > 0) {
    lines.push(`Free gift: ${product.freeGifts.join(', ')}`);
  }

  lines.push(`Link: ${window.location.origin}/product/${product.slug}`);
  lines.push(
    product.availability === 'out_of_stock' || product.quantity === 0
      ? 'When will it be available?'
      : 'Is it available?'
  );

  return whatsappLink(lines.join('\n'));
}
