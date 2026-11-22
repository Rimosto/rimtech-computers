import { formatKsh } from './format';
import { whatsappLink } from './whatsapp';

function makeRef(date = new Date()) {
  const day = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RT-${day}-${random}`;
}

export function buildOrderMessage({ ref, customer, items, subtotal }) {
  const isDelivery = customer.delivery === 'delivery';
  const out = [];

  out.push('*New order from the RimTech website*');
  out.push(`Order ref: ${ref}`);
  out.push('');
  out.push(`*Customer:* ${customer.name}`);
  out.push(`*Phone:* ${customer.phone}`);
  out.push(
    isDelivery ? `*Delivery to:* ${customer.location}` : '*Collection:* I will pick up from the shop'
  );
  out.push('');
  out.push('*Items*');

  items.forEach((item, index) => {
    out.push(`${index + 1}. ${item.name}`);
    if (item.model && !item.name.toLowerCase().includes(item.model.toLowerCase())) {
      out.push(`   Model: ${item.model}`);
    }
    out.push(`   Qty: ${item.quantity} x ${formatKsh(item.unitPrice)} = ${formatKsh(item.lineTotal)}`);
    if (item.oldPrice) out.push(`   Offer price (was ${formatKsh(item.oldPrice)})`);
    if (item.gifts.length > 0) out.push(`   Free gift: ${item.gifts.join(', ')}`);
  });

  out.push('');
  out.push(`*Total${isDelivery ? ' (excluding delivery)' : ''}: ${formatKsh(subtotal)}*`);
  out.push(isDelivery ? 'Delivery fee: to be confirmed' : 'Delivery fee: none (pick up)');
  out.push('Payment: to be arranged on WhatsApp');
  out.push('');
  out.push(`*Customer enquiry:* ${customer.notes || 'None'}`);

  return out.join('\n');
}

export function createOrder({ customer, lines, subtotal, savings }) {
  const ref = makeRef();

  const items = lines.map(({ product, quantity, unitPrice, lineTotal, offer }) => ({
    name: product.name,
    model: product.model || '',
    quantity,
    unitPrice,
    lineTotal,
    oldPrice: offer ? offer.oldPrice : null,
    gifts: product.freeGifts || [],
  }));

  const message = buildOrderMessage({ ref, customer, items, subtotal });

  return {
    ref,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    savings,
    whatsappUrl: whatsappLink(message),
  };
}
