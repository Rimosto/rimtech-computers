// Business details used by the About and Contact pages.
// Leave a field as '' and it is simply not shown. Fill these in when you are ready.

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export const business = {
  name: 'RimTech Computers',
  whatsapp: number,
  phone: number, // change this if your calling number is different from WhatsApp
  email: '',
  address: '', // for example: 'Moi Avenue, Nairobi'
  mapsUrl: '', // a Google Maps link to the shop
  hours: '', // for example: 'Monday to Saturday, 8:00 am to 6:00 pm'
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
  story: '', // an optional short paragraph shown on the About page
};

// 254798488986 becomes +254 798 488 986
export function formatInternational(digits) {
  const match = String(digits).match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]}` : `+${digits}`;
}
