import { useState } from 'react';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { formatKsh } from '../utils/format';
import { clearLastOrder, loadLastOrder } from '../utils/orderStorage';
import './Cart.css';

export default function OrderConfirmation() {
  const { clear } = useCart();
  const [order] = useState(loadLastOrder);
  const [done, setDone] = useState(false);

  if (!order) {
    return (
      <section className="container page cart-page">
        <h1>No recent order</h1>
        <div className="empty-cart">
          <p>We could not find an order to show. Start from your cart to place one.</p>
          <Button to="/cart">Go to cart</Button>
        </div>
      </section>
    );
  }

  function handleSent() {
    clear();
    clearLastOrder();
    setDone(true);
  }

  if (done) {
    return (
      <section className="container page cart-page confirm-box">
        <h1>Thank you, {order.customer.name}</h1>
        <p>
          Your order <span className="order-ref">{order.ref}</span> is on its way to our team. We
          will reply on WhatsApp to confirm availability, delivery and payment.
        </p>
        <div className="confirm-actions">
          <Button to="/shop">Continue shopping</Button>
          <Button to="/" variant="outline">
            Back to home
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container page cart-page confirm-box">
      <h1>Your order is ready to send</h1>
      <p>
        Order reference <span className="order-ref">{order.ref}</span>
      </p>

      <ol className="confirm-steps">
        <li>WhatsApp should have opened with your order message. If it did not, use the button below.</li>
        <li>Check the message, then press send in WhatsApp.</li>
        <li>Come back here and tap &quot;I have sent my order&quot;.</li>
      </ol>

      <div className="summary">
        <h2>Order summary</h2>
        <ul className="summary-items">
          {order.items.map((item) => (
            <li key={item.name}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatKsh(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatKsh(order.subtotal)}</span>
        </div>
        <p className="summary-note">
          {order.customer.delivery === 'delivery'
            ? `Delivery to ${order.customer.location}. The delivery fee is confirmed on WhatsApp.`
            : 'You will pick up from the shop.'}
        </p>
      </div>

      <div className="confirm-actions">
        <Button href={order.whatsappUrl} target="_blank" rel="noreferrer">
          Open WhatsApp
        </Button>
        <Button type="button" variant="dark" onClick={handleSent}>
          I have sent my order
        </Button>
        <Button to="/cart" variant="outline">
          Edit my order
        </Button>
      </div>
    </section>
  );
}
