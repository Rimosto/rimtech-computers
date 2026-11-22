import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ShareButton from '../components/common/ShareButton';
import AddToCartButton from '../components/cart/AddToCartButton';
import ImageGallery from '../components/products/ImageGallery';
import ProductCard from '../components/products/ProductCard';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { availabilityInfo } from '../utils/availability';
import { canAddToCart } from '../utils/cart';
import { formatKsh } from '../utils/format';
import { getOffer } from '../utils/offers';
import { productEnquiryLink } from '../utils/whatsapp';
import './ProductDetails.css';
import './ProductExtras.css';

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!product) return undefined;
    const previous = document.title;
    document.title = `${product.name} | RimTech Computers`;
    return () => {
      document.title = previous;
    };
  }, [product]);

  if (!product) {
    return (
      <section className="container page not-found">
        <h1>Product not found</h1>
        <p>
          We could not find that product. It may have been removed or the link may be incorrect.
        </p>
        <Button to="/shop">Back to the shop</Button>
      </section>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const stock = availabilityInfo(product.availability, product.quantity);
  const offer = getOffer(product);
  const canAdd = canAddToCart(product);
  const hasPrice = product.price !== null && product.price !== undefined;
  const gifts = product.freeGifts || [];
  const highlights = product.highlights || [];
  const included = product.included || [];

  let enquiryVariant = 'primary';
  if (canAdd) enquiryVariant = 'outline';
  else if (stock.soldOut) enquiryVariant = 'dark';

  const quickSpecs = [
    product.processor,
    product.ram,
    product.storage,
    product.display,
    product.colour,
  ]
    .filter(Boolean)
    .slice(0, 5);

  const specRows = [
    ['Brand', product.brand],
    ['Model', product.model],
    ['Category', category?.name],
    ['Condition', product.condition],
    ['Processor', product.processor],
    ['RAM', product.ram],
    ['Storage', product.storage],
    ['Display', product.display],
    ['Resolution', product.resolution],
    ['Graphics', product.graphics],
    ['Operating system', product.os],
    ['Colour', product.colour],
    ['Ports', product.ports],
    ['Connectivity', product.connectivity],
    ['Battery', product.battery],
    ['Weight', product.weight],
    ['Warranty', product.warranty],
  ].filter(([, value]) => Boolean(value));

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <section className="container page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop">Shop</Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/shop?category=${category.slug}`}>{category.name}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp">
          <ImageGallery key={product.id} images={product.images} alt={product.name} />

          <div className="pdp-info">
            {product.brand && <span className="pdp-brand">{product.brand}</span>}
            <h1>{product.name}</h1>
            {product.model && !product.name.toLowerCase().includes(product.model.toLowerCase()) && (
              <p className="pdp-model">Model: {product.model}</p>
            )}

            <div className="stock-row">
              <span className={`stock stock-${stock.tone}`}>{stock.label}</span>
              {stock.tone === 'in' && stock.quantity !== null && (
                <span className="stock-count">{stock.quantity} available</span>
              )}
            </div>

            <div className="price-block">
              <p className={hasPrice ? 'pdp-price' : 'pdp-price muted'}>
                {formatKsh(product.price)}
              </p>
              {offer && (
                <>
                  <span className="price-old-lg">{formatKsh(offer.oldPrice)}</span>
                  <span className="save-pill">
                    Save {formatKsh(offer.savings)} ({offer.percent}% off)
                  </span>
                </>
              )}
            </div>

            {offer && (
              <div className="offer-banner">
                <strong>{offer.label}</strong>
                {offer.endsLabel ? ` ends ${offer.endsLabel}.` : ' while stocks last.'}
              </div>
            )}

            {quickSpecs.length > 0 && (
              <ul className="quick-specs" aria-label="Key specifications">
                {quickSpecs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}

            {gifts.length > 0 && (
              <div className="gift-box">
                <h3>Free with this product</h3>
                <ul>
                  {gifts.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pdp-actions">
              {canAdd && <AddToCartButton product={product} />}
              <Button
                href={productEnquiryLink(product)}
                target="_blank"
                rel="noreferrer"
                variant={enquiryVariant}
              >
                {stock.soldOut ? 'Ask when available' : 'Enquire on WhatsApp'}
              </Button>
              <ShareButton title={product.name} text={`${product.name} at RimTech Computers`} />
            </div>

            <p className="pdp-note">
              Your WhatsApp message is filled in for you. You can review it before sending.
            </p>
          </div>
        </div>

        {product.description && (
          <div className="pdp-section">
            <h2>Description</h2>
            <p className="pdp-description">{product.description}</p>
          </div>
        )}

        {highlights.length > 0 && (
          <div className="pdp-section">
            <h2>Key features</h2>
            <ul className="feature-list">
              {highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pdp-section">
          <h2>Specifications</h2>
          <table className="specs">
            <tbody>
              {specRows.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pdp-note">
            Need more details?{' '}
            <a
              href={productEnquiryLink(product)}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              Ask us on WhatsApp
            </a>
            .
          </p>
        </div>

        {included.length > 0 && (
          <div className="pdp-section">
            <h2>What is in the box</h2>
            <ul className="feature-list">
              {included.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {similar.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2>Similar products</h2>
              {category && (
                <Link to={`/shop?category=${category.slug}`} className="link-arrow">
                  View all {category.name.toLowerCase()}
                </Link>
              )}
            </div>
            <div className="product-grid">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
