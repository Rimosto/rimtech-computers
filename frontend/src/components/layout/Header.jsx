import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';
import './Header.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const close = () => setOpen(false);
  const cartLabel = `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className="nav" aria-label="Main navigation">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
          <Button to="/cart" size="sm" aria-label={cartLabel}>
            Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Button>
        </nav>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
              {l.label}
            </NavLink>
          ))}
          <Button to="/cart" onClick={close} aria-label={cartLabel}>
            View cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Button>
        </nav>
      )}
    </header>
  );
}
