import { useState } from 'react';
import './ImageGallery.css';

export default function ImageGallery({ images = [], alt }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="gallery-main gallery-placeholder" role="img" aria-label={`${alt}, photo coming soon`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M8 20h8M12 16v4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  const index = Math.min(active, images.length - 1);

  return (
    <div>
      <div className="gallery-main">
        <img src={images[index]} alt={alt} />
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className="gallery-thumb"
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
