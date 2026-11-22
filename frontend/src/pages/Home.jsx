import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Testimonials from '../components/home/Testimonials';
import ProductCard from '../components/products/ProductCard';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { whatsappLink } from '../utils/whatsapp';

const featured = products.filter((p) => p.featured);

const reasons = [
  {
    title: 'Order on WhatsApp',
    text: 'Pick a product, tap once and send your order or question straight to our team.',
  },
  {
    title: 'Clear specifications',
    text: 'See the processor, RAM, storage and condition before you enquire.',
  },
  {
    title: 'Prices in KSh',
    text: 'Straightforward pricing in Kenyan shillings, with no guesswork.',
  },
  {
    title: 'Everything in one place',
    text: 'Laptops, desktops, monitors and accessories from one trusted store.',
  },
];

export default function Home() {
  return (
    <>
      {/* HOME-03: Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">RimTech Computers, Kenya</span>
          <h1>
            Power Your Digital World With The <span className="highlight">Right Technology.</span>
          </h1>
          <p className="hero-text">
            Laptops, desktop computers, monitors and accessories. Browse the range, compare
            specifications and order on WhatsApp.
          </p>
          <div className="hero-actions">
            <Button to="/shop">Shop Now</Button>
            <Button
              href={whatsappLink('Hello RimTech, I would like to place an order.')}
              target="_blank"
              rel="noreferrer"
              variant="outline-light"
            >
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* HOME-04: Shop by category */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by category</h2>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c.slug} to={`/shop?category=${c.slug}`} className="category-card">
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOME-05: Featured products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Featured products</h2>
            <Link to="/shop" className="link-arrow">
              View all
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HOME-07: Promotional banner */}
      <section className="section">
        <div className="container">
          <div className="promo">
            <div>
              <h2>Looking for something specific?</h2>
              <p>Tell us what you need and we will help you find the right computer or accessory.</p>
            </div>
            <Button
              href={whatsappLink('Hello RimTech, I am looking for ')}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* HOME-08: Why choose RimTech */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Why choose RimTech</h2>
          </div>
          <div className="reason-grid">
            {reasons.map((r) => (
              <div key={r.title} className="reason-card">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOME-09: Customer feedback */}
      <Testimonials />
    </>
  );
}
