import { Link } from 'react-router-dom';
import Button from '../common/Button';
import AddToCartButton from '../cart/AddToCartButton';
import { formatKsh } from '../../utils/format';
import { availabilityInfo } from '../../utils/availability';
import { canAddToCart } from '../../utils/cart';
import { getOffer } from '../../utils/offers';
import { productEnquiryLink } from '../../utils/whatsapp';
import './ProductCard.css';
import '../cart/CartBits.css';

function ImagePlaceholder() {
  return (
    <div className="product-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function ProductCard({ product }) {
  const hasPrice = product.price !== null && product.price !== undefined;
  const image = product.images && product.images.length > 0 ? product.images[0] : null;
  const stock = availabilityInfo(product.availability, product.quantity);
  const offer = getOffer(product);
  const hasGift = product.freeGifts && product.freeGifts.length > 0;
  const canAdd = canAddToCart(product);

  let enquiryVariant = 'primary';
  if (canAdd) enquiryVariant = 'outline';
  else if (stock.soldOut) enquiryVariant = 'dark';

  return (
    <article className={stock.soldOut ? 'product-card is-out' : 'product-card'}>
      <Link to={`/product/${product.slug}`} className="product-image">
        {image ? <img src={image} alt={product.name} loading="lazy" /> : <ImagePlaceholder />}
        <span className={`badge badge-${stock.tone}`}>{stock.label}</span>
        {offer && <span className="offer-tag">-{offer.percent}%</span>}
      </Link>
      <div className="product-body">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <h3 className="product-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-price-row">
          <p className={hasPrice ? 'product-price' : 'product-price muted'}>
            {formatKsh(product.price)}
          </p>
          {offer && <span className="price-old">{formatKsh(offer.oldPrice)}</span>}
        </div>
        {hasGift && <span className="gift-pill">Free gift included</span>}

        <div className="card-actions">
          {canAdd && <AddToCartButton product={product} size="sm" block />}
          <Button
            href={productEnquiryLink(product)}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant={enquiryVariant}
            block
          >
            {stock.soldOut ? 'Ask when available' : 'Enquire on WhatsApp'}
          </Button>
        </div>
      </div>
    </article>
  );
}
