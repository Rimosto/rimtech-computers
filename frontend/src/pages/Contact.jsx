import { useState } from 'react';
import Button from '../components/common/Button';
import { business, formatInternational } from '../data/business';
import { usePageTitle } from '../hooks/usePageTitle';
import { normaliseKenyanPhone } from '../utils/phone';
import { whatsappLink } from '../utils/whatsapp';
import './Cart.css';
import './InfoPages.css';

const initialValues = { name: '', phone: '', message: '' };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  if (values.phone.trim() && !normaliseKenyanPhone(values.phone)) {
    errors.phone = 'Enter a valid Kenyan phone number, for example 0712 345 678, or leave it blank.';
  }
  if (values.message.trim().length < 5) {
    errors.message = 'Please write your message.';
  } else if (values.message.length > 1000) {
    errors.message = 'Please keep your message under 1000 characters.';
  }
  return errors;
}

function buildMessage(values) {
  const lines = [`Hello RimTech, my name is ${values.name.trim()}.`];
  const phone = normaliseKenyanPhone(values.phone);
  if (phone) lines.push(`My phone: ${phone}`);
  lines.push('', values.message.trim());
  return lines.join('\n');
}

export default function Contact() {
  usePageTitle(`Contact us | ${business.name}`);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [sentLink, setSentLink] = useState('');

  const details = [
    business.phone && {
      label: 'Phone and WhatsApp',
      node: (
        <a href={`tel:+${business.phone}`}>{formatInternational(business.phone)}</a>
      ),
    },
    business.email && {
      label: 'Email',
      node: <a href={`mailto:${business.email}`}>{business.email}</a>,
    },
    business.address && {
      label: 'Location',
      node: (
        <>
          {business.address}
          {business.mapsUrl && (
            <>
              {' '}
              <a href={business.mapsUrl} target="_blank" rel="noreferrer">
                View on map
              </a>
            </>
          )}
        </>
      ),
    },
    business.hours && { label: 'Opening hours', node: business.hours },
    ...Object.entries(business.social)
      .filter(([, url]) => url)
      .map(([name, url]) => ({
        label: name.charAt(0).toUpperCase() + name.slice(1),
        node: (
          <a href={url} target="_blank" rel="noreferrer">
            {url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        ),
      })),
  ].filter(Boolean);

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
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    const url = whatsappLink(buildMessage(values));
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentLink(url);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <section className="container page">
      <h1>Contact us</h1>
      <p className="lead">
        The quickest way to reach us is WhatsApp. Ask about a product, check availability or get
        help choosing.
      </p>

      <div className="contact-layout">
        <div className="contact-card">
          <h2>Get in touch</h2>
          <ul className="contact-list">
            {details.map((d) => (
              <li key={d.label}>
                <span className="contact-label">{d.label}</span>
                {d.node}
              </li>
            ))}
          </ul>
          <div className="contact-buttons">
            <Button
              href={whatsappLink('Hello RimTech, I have a question.')}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </Button>
            {business.phone && (
              <Button href={`tel:+${business.phone}`} variant="outline">
                Call us
              </Button>
            )}
          </div>
        </div>

        <div className="contact-card">
          <h2>Send us a message</h2>
          <form onSubmit={handleSubmit} noValidate>
            {attempted && errorCount > 0 && (
              <div className="form-error-summary" role="alert">
                Please fix the {errorCount === 1 ? 'highlighted field' : 'highlighted fields'} below.
              </div>
            )}

            <div className="form-field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="form-input"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'contact-error-name' : undefined}
              />
              {errors.name && (
                <p id="contact-error-name" className="field-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="contact-phone">Phone number (optional)</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                className="form-input"
                autoComplete="tel"
                placeholder="0712 345 678"
                value={values.phone}
                onChange={handleChange}
                aria-invalid={errors.phone ? 'true' : undefined}
                aria-describedby={errors.phone ? 'contact-error-phone' : undefined}
              />
              {errors.phone && (
                <p id="contact-error-phone" className="field-error">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                className="form-input"
                placeholder="What are you looking for, or what would you like to ask?"
                value={values.message}
                onChange={handleChange}
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'contact-error-message' : undefined}
              />
              {errors.message && (
                <p id="contact-error-message" className="field-error">
                  {errors.message}
                </p>
              )}
            </div>

            <Button type="submit" block>
              Send on WhatsApp
            </Button>
            <p className="summary-note">
              WhatsApp opens with your message already written. You review it and press send.
            </p>

            {sentLink && (
              <p className="contact-success" role="status">
                WhatsApp should have opened. If it did not,{' '}
                <a href={sentLink} target="_blank" rel="noreferrer">
                  open it here
                </a>
                .
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
