const NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function whatsappLink(message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${NUMBER}${text}`;
}

export function productEnquiryLink(product) {
  return whatsappLink(
    `Hello RimTech, I'm interested in the ${product.name}. Is it available, and what is the price?`
  );
}