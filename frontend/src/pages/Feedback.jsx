import { useState } from 'react';
import Button from '../components/common/Button';
import { business } from '../data/business';
import { usePageTitle } from '../hooks/usePageTitle';
import { whatsappLink } from '../utils/whatsapp';
import './Cart.css';
import './InfoPages.css';
import './Feedback.css';

const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent' };
const initialValues = { rating: 0, name: '', product: '', message: '', consent: false };

function validate(values) {
  const errors = {};
  if (values.rating < 1) {
    errors.rating = 'Please choose a rating from 1 to 5 stars.';
  }
  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Please tell us a little more, at least a short sentence.';
  } else if (values.message.length > 1000) {
    errors.message = 'Please keep your feedback under 1000 characters.';
  }
  return errors;
}

function buildMessage(values) {
  const stars = '★'.repeat(values.rating) + '☆'.repeat(5 - values.rating);
  const lines = [
    '*Customer feedback for RimTech*',
    `Rating: ${stars} (${values.rating}/5)`,
    `Name: ${values.name.trim()}`,
  ];
  if (values.product.trim()) lines.push(`Product: ${values.product.trim()}`);
  lines.push('', `Feedback: ${values.message.trim()}`, '');
  lines.push(`May we show this on the website? ${values.consent ? 'Yes' : 'No'}`);
  return lines.join('\n');
}

export default function Feedback() {
  usePageTitle(`Share your feedback | ${business.name}`);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [sentLink, setSentLink] = useState('');

  function setField(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setField(name, type === 'checkbox' ? checked : value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const id = firstInvalid === 'rating' ? 'feedback-rating' : `feedback-${firstInvalid}`;
      document.getElementById(id)?.focus();
      return;
    }

    const url = whatsappLink(buildMessage(values));
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentLink(url);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <section className="container page">
      <h1>Share your feedback</h1>
      <p className="lead">
        Bought something from {business.name}? Tell us how it went. We read every message, and with
        your permission we may show your feedback on this website.
      </p>

      <div className="feedback-card">
        <form onSubmit={handleSubmit} noValidate>
          {attempted && errorCount > 0 && (
            <div className="form-error-summary" role="alert">
              Please fix the {errorCount === 1 ? 'highlighted field' : 'highlighted fields'} below.
            </div>
          )}

          <div className="form-field">
            <fieldset>
              <legend>How was your experience?</legend>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className={n <= values.rating ? 'star-option on' : 'star-option'}>
                    <input
                      id={n === 1 ? 'feedback-rating' : undefined}
                      type="radio"
                      name="rating"
                      value={n}
                      checked={values.rating === n}
                      onChange={() => setField('rating', n)}
                      aria-describedby={errors.rating ? 'feedback-error-rating' : undefined}
                    />
                    <span aria-hidden="true">&#9733;</span>
                    <span className="sr-only">
                      {n} {n === 1 ? 'star' : 'stars'}, {ratingLabels[n]}
                    </span>
                  </label>
                ))}
                {values.rating > 0 && <span className="rating-text">{ratingLabels[values.rating]}</span>}
              </div>
              {errors.rating && (
                <p id="feedback-error-rating" className="field-error">
                  {errors.rating}
                </p>
              )}
            </fieldset>
          </div>

          <div className="form-field">
            <label htmlFor="feedback-name">Your name</label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              className="form-input"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'feedback-error-name' : undefined}
            />
            {errors.name && (
              <p id="feedback-error-name" className="field-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="feedback-product">Product you bought (optional)</label>
            <input
              id="feedback-product"
              name="product"
              type="text"
              className="form-input"
              placeholder="For example: HP Laptop"
              value={values.product}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="feedback-message">Your feedback</label>
            <textarea
              id="feedback-message"
              name="message"
              className="form-input"
              placeholder="What did you like? Is there anything we could do better?"
              value={values.message}
              onChange={handleChange}
              aria-invalid={errors.message ? 'true' : undefined}
              aria-describedby={errors.message ? 'feedback-error-message' : undefined}
            />
            {errors.message && (
              <p id="feedback-error-message" className="field-error">
                {errors.message}
              </p>
            )}
          </div>

          <div className="form-field">
            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={values.consent}
                onChange={handleChange}
              />
              <span>
                You may show my feedback on the RimTech website with my first name and the initial
                of my surname.
              </span>
            </label>
          </div>

          <Button type="submit" block>
            Send feedback on WhatsApp
          </Button>
          <p className="summary-note">
            WhatsApp opens with your feedback already written. You review it and press send.
          </p>

          {sentLink && (
            <p className="contact-success" role="status">
              Thank you. WhatsApp should have opened. If it did not,{' '}
              <a href={sentLink} target="_blank" rel="noreferrer">
                open it here
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
