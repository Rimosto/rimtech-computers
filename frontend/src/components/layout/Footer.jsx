import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { business, formatInternational } from '../../data/business';
import { whatsappLink } from '../../utils/whatsapp';

export default function Footer() {
  const socials = Object.entries(business.social).filter(([, url]) => url);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>{business.name}</h3>
          <p>Laptops, desktops, phones and computer accessories for customers across Kenya.</p>
        </div>

        <div>
          <h3>Shop</h3>
          <ul>
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/feedback">Share your feedback</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Order and enquiries</h3>
          <ul>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                WhatsApp {formatInternational(business.whatsapp)}
              </a>
            </li>
            {business.email && (
              <li>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
            )}
            {business.address && <li>{business.address}</li>}
            {business.hours && <li>{business.hours}</li>}
            {socials.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noreferrer">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}
