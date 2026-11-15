const number = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function AnnouncementBar() {
  return (
    <div className="announcement">
      Computers, laptops and accessories in Kenya. Order on{' '}
      <a href={`https://wa.me/${number}`} target="_blank" rel="noreferrer">
        WhatsApp +{number}
      </a>
    </div>
  );
}