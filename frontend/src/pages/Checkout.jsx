import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { formatKsh } from '../utils/format';
import { createOrder } from '../utils/orderMessage';
import { saveLastOrder } from '../utils/orderStorage';
import { normaliseKenyanPhone } from '../utils/phone';
import './Cart.css';

const initialValues = { name: '', phone: '', delivery: 'pickup', location: '', notes: '' };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!normaliseKenyanPhone(values.phone)) {
    errors.phone = 'Enter a valid Kenyan phone number, for example 0712 345 678.';
  }
  if (values.delivery === 'delivery' && values.location.trim().length < 3) {
    errors.location = 'Tell us where we should deliver.';
  }
  if (values.notes.length > 500) {
    errors.notes = 'Please keep your notes under 500 characters.';
  }
  return errors;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { lines, itemCount, subtotal, savings } = useCart();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="container page cart-page">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add a product to your cart before checking out.</p>
          <Button to="/shop">Go to the shop</Button>
        </div>
      </section>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    const order = createOrder({
      customer: {
        name: values.name.trim(),
        phone: normaliseKenyanPhone(values.phone),
        delivery: values.delivery,
        location: values.delivery === 'delivery' ? values.location.trim() : '',
        notes: values.notes.trim(),
      },
      lines,
      subtotal,
      savings,
    });

    saveLastOrder(order);
    window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer');
    navigate('/order-confirmation');
  }

  const errorCount = Object.keys(errors).length;

  return (
    <section className="container page cart-page">
      <h1>Checkout</h1>

      <div className="cart-layout">
        <form onSubmit={handleSubmit} noValidate>
          {attempted && errorCount > 0 && (
            <div className="form-error-summary" role="alert">
              Please fix the {errorCount === 1 ? 'highlighted field' : 'highlighted fields'} below.
            </div>
          )}

          <div className="form-field">
            <label htmlFor="field-name">Full name</label>
            <input
              id="field-name"
              name="name"
              type="text"
              className="form-input"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'error-name' : undefined}
            />
            {errors.name && (
              <p id="error-name" className="field-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="field-phone">Phone number</label>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              className="form-input"
              autoComplete="tel"
              placeholder="0712 345 678"
              value={values.phone}
              onChange={handleChange}
              aria-invalid={errors.phone ? 'true' : undefined}
              aria-describedby={errors.phone ? 'error-phone' : undefined}
            />
            {errors.phone && (
              <p id="error-phone" className="field-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="form-field">
            <fieldset>
              <legend>How would you like to receive your order?</legend>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={values.delivery === 'pickup'}
                    onChange={handleChange}
                  />
                  Pick up from the shop
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={values.delivery === 'delivery'}
                    onChange={handleChange}
                  />
                  Delivery (fee confirmed on WhatsApp)
                </label>
              </div>
            </fieldset>
          </div>

          {values.delivery === 'delivery' && (
            <div className="form-field">
              <label htmlFor="field-location">Delivery location</label>
              <input
                id="field-location"
                name="location"
                type="text"
                className="form-input"
                autoComplete="street-address"
                placeholder="Estate, street or building, and town"
                value={values.location}
                onChange={handleChange}
                aria-invalid={errors.location ? 'true' : undefined}
                aria-describedby={errors.location ? 'error-location' : undefined}
              />
              {errors.location && (
                <p id="error-location" className="field-error">
                  {errors.location}
                </p>
              )}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="field-notes">Notes or questions (optional)</label>
            <textarea
              id="field-notes"
              name="notes"
              className="form-input"
              placeholder="For example the specs you want, a preferred delivery time, or a question about a product."
              value={values.notes}
              onChange={handleChange}
              aria-invalid={errors.notes ? 'true' : undefined}
              aria-describedby={errors.notes ? 'error-notes' : 'hint-notes'}
            />
            {errors.notes ? (
              <p id="error-notes" className="field-error">
                {errors.notes}
              </p>
            ) : (
              <p id="hint-notes" className="form-hint">
                {values.notes.length}/500 characters
              </p>
            )}
          </div>

          <Button type="submit" block>
            Send order on WhatsApp
          </Button>
          <p className="summary-note">
            WhatsApp opens with your order already written. You review it and press send. Nothing is
            paid on this site.
          </p>
        </form>

        <aside className="summary" aria-label="Order summary">
          <h2>Your order</h2>
          <ul className="summary-items">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id}>
                <span>
                  {product.name} x {quantity}
                </span>
                <span>{formatKsh(lineTotal)}</span>
              </li>
            ))}
          </ul>
          {savings > 0 && (
            <div className="summary-row save">
              <span>You save</span>
              <span>{formatKsh(savings)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total ({itemCount})</span>
            <span>{formatKsh(subtotal)}</span>
          </div>
          <p className="summary-note">Delivery fee, if any, is confirmed on WhatsApp.</p>
          <Button to="/cart" variant="outline" block>
            Edit cart
          </Button>
        </aside>
      </div>
    </section>
  );
}
