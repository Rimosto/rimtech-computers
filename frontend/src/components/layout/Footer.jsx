import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { whatsappLink } from '../../utils/whatsapp';

const number = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>RimTech Computers</h3>
          <p>Laptops, desktops and computer accessories for customers across Kenya.</p>
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
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Order and enquiries</h3>
          <p>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              WhatsApp +{number}
            </a>
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        &copy; {new Date().getFullYear()} RimTech Computers. All rights reserved.
      </div>
    </footer>
  );
}