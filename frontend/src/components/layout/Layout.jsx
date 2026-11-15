import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <nav className="container">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}