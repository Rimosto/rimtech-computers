import { Link } from 'react-router-dom';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import { testimonials } from '../../data/testimonials';
import './Testimonials.css';

function monthYear(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
}

export default function Testimonials() {
  const items = [...testimonials]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        {items.length > 0 ? (
          <>
            <div className="section-head">
              <h2>What our customers say</h2>
              <Link to="/feedback" className="link-arrow">
                Share your feedback
              </Link>
            </div>
            <div className="testimonial-grid">
              {items.map((t) => (
                <figure key={t.id} className="testimonial">
                  <StarRating rating={t.rating} />
                  <blockquote>
                    <p>{t.text}</p>
                  </blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>
                      {[t.location, t.product, monthYear(t.date)].filter(Boolean).join(' · ')}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="feedback-cta">
            <div>
              <h2>Bought from RimTech?</h2>
              <p>
                Tell us how it went. Your feedback helps other customers choose with confidence and
                helps us do better.
              </p>
            </div>
            <Button to="/feedback">Share your experience</Button>
          </div>
        )}
      </div>
    </section>
  );
}
