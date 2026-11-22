import Button from '../components/common/Button';
import { business } from '../data/business';
import { usePageTitle } from '../hooks/usePageTitle';
import { whatsappLink } from '../utils/whatsapp';
import './InfoPages.css';

const offers = [
  {
    title: 'Computers and devices',
    text: 'Laptops, desktop computers, phones and monitors, listed with clear specifications and prices in KSh.',
  },
  {
    title: 'Accessories and software',
    text: 'Headsets, mice, stands and security software to go with your device.',
  },
  {
    title: 'Honest availability',
    text: 'We show what is in stock and how many are left, and we tell you plainly when something is sold out.',
  },
  {
    title: 'Help choosing',
    text: 'Not sure which one fits your budget or your work? Message us and we will guide you.',
  },
];

const steps = [
  {
    title: 'Choose',
    text: 'Browse the shop and compare specifications, prices and offers.',
  },
  {
    title: 'Add to cart',
    text: 'Add what you want and check out with your name and phone number.',
  },
  {
    title: 'Send on WhatsApp',
    text: 'Your order opens in WhatsApp, already written. Review it and press send.',
  },
  {
    title: 'We confirm',
    text: 'We reply to confirm availability, delivery or pickup, and how to pay.',
  },
];

export default function About() {
  usePageTitle(`About us | ${business.name}`);

  return (
    <section className="container page">
      <h1>About {business.name}</h1>
      <p className="lead">
        {business.name} helps people and businesses in Kenya find the right technology. Browse the
        range, compare the details, and place your order on WhatsApp.
      </p>
      {business.story && <p className="story">{business.story}</p>}

      <div className="info-section">
        <h2>What we offer</h2>
        <div className="reason-grid">
          {offers.map((o) => (
            <div key={o.title} className="reason-card">
              <h3>{o.title}</h3>
              <p>{o.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>How ordering works</h2>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="info-section">
        <div className="promo">
          <div>
            <h2>Ready to find your next device?</h2>
            <p>Start in the shop, or tell us what you need and we will help you choose.</p>
          </div>
          <div className="hero-actions">
            <Button to="/shop">Shop now</Button>
            <Button
              href={whatsappLink('Hello RimTech, I need help choosing a product.')}
              target="_blank"
              rel="noreferrer"
              variant="outline-light"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
