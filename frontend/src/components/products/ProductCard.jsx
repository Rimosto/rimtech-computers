import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { formatKsh } from '../../utils/format';
import { productEnquiryLink } from '../../utils/whatsapp';
import './ProductCard.css';

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

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <ImagePlaceholder />
        )}
      </Link>
      <div className="product-body">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <h3 className="product-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={hasPrice ? 'product-price' : 'product-price muted'}>
          {formatKsh(product.price)}
        </p>
        <Button
          href={productEnquiryLink(product)}
          target="_blank"
          rel="noreferrer"
          size="sm"
          block
        >
          Enquire on WhatsApp
        </Button>
      </div>
    </article>
  );
}
