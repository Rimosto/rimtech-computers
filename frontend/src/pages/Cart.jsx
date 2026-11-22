import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { formatKsh } from '../utils/format';
import { maxQuantity } from '../utils/cart';
import './Cart.css';

function Thumb({ product }) {
  const image = product.images && product.images.length > 0 ? product.images[0] : null;
  return (
    <div className="cart-thumb">
      {image ? (
        <img src={image} alt="" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M8 20h8M12 16v4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export default function Cart() {
  const { lines, itemCount, subtotal, savings, setQuantity, removeItem, clear } = useCart();

  if (lines.length === 0) {
    return (
      <section className="container page cart-page">
        <h1>Your cart</h1>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse the shop and add the products you want. You can also ask us on WhatsApp.</p>
          <Button to="/shop">Start shopping</Button>
        </div>
      </section>
    );
  }

  function handleClear() {
    if (window.confirm('Remove all items from your cart?')) clear();
  }

  return (
    <section className="container page cart-page">
      <h1>Your cart</h1>

      <div className="cart-layout">
        <ul className="cart-lines">
          {lines.map(({ product, quantity, lineTotal, offer }) => {
            const max = maxQuantity(product);
            const gifts = product.freeGifts || [];
            return (
              <li key={product.id} className="cart-line">
                <Thumb product={product} />
                <div>
                  <p className="cart-line-name">
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  </p>
                  <p className="cart-line-meta">
                    {formatKsh(product.price)} each
                    {offer && <> (was {formatKsh(offer.oldPrice)})</>}
                  </p>
                  {gifts.length > 0 && (
                    <p className="cart-line-gift">Free gift: {gifts.join(', ')}</p>
                  )}

                  <div className="cart-line-controls">
                    <div className="qty" role="group" aria-label={`Quantity for ${product.name}`}>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(product.id, quantity - 1)}
                      >
                        -
                      </button>
                      <output aria-live="polite">{quantity}</output>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={quantity >= max}
                        onClick={() => setQuantity(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="line-total">{formatKsh(lineTotal)}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(product.id)}
                    >
                      Remove
                    </button>
                  </div>

                  {quantity >= max && Number.isFinite(product.quantity) && (
                    <p className="stock-limit">That is all we have in stock.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>
              Items ({itemCount})
            </span>
            <span>{formatKsh(subtotal)}</span>
          </div>
          {savings > 0 && (
            <div className="summary-row save">
              <span>You save</span>
              <span>{formatKsh(savings)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Delivery</span>
            <span>Confirmed on WhatsApp</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatKsh(subtotal)}</span>
          </div>
          <p className="summary-note">
            Payment is arranged on WhatsApp after we confirm availability.
          </p>

          <div className="summary-actions">
            <Button to="/checkout" block>
              Proceed to checkout
            </Button>
            <Button to="/shop" variant="outline" block>
              Continue shopping
            </Button>
            <button type="button" className="remove-btn" onClick={handleClear}>
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
