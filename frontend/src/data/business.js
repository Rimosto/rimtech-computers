// Business details used by the About, Contact and Footer sections.
// Leave a field as '' and it is simply not shown. Fill these in when you are ready.

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export const business = {
  name: 'RimTech Computers',
  whatsapp: number,
  phone: number, // change this if your calling number is different from WhatsApp
  email: 'rimtechcomputers@gmail.com',
  address: 'Cookie House, 5th Floor, Suite 501, Accra Road (directly opposite Simara Mall), Nairobi',
  // Opens Google Maps with a search for the shop. Replace it with your exact pin link when you have one.
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Cookie House, Accra Road, Nairobi')}`,
  hours: '', // for example: 'Monday to Saturday, 8:00 am to 6:00 pm'
  social: {
    facebook: '', // full link, for example: 'https://www.facebook.com/yourpage'
    instagram: '',
    tiktok: '',
  },
  story: `RimTech Computers is a technology store on Accra Road in Nairobi, on the 5th floor of Cookie House, directly opposite Simara Mall. We help people and businesses across Kenya find the right computer, phone or accessory without the confusion.

Our approach is simple. Every product on this website shows its real specifications, its price in KSh, and how many units are left, so you can compare before you decide.

We also know many customers like to speak to a real person before they buy. That is why ordering happens on WhatsApp, where our team confirms availability, answers your questions and arranges pickup or delivery.

Visit us at Suite 501, or message us any time.`,
};

// 254798488986 becomes +254 798 488 986
export function formatInternational(digits) {
  const match = String(digits).match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]}` : `+${digits}`;
}
