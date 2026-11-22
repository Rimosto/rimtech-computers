import { useState } from 'react';
import Button from './Button';

export default function ShareButton({ title, text }) {
  const [status, setStatus] = useState('');

  function flash(message) {
    setStatus(message);
    setTimeout(() => setStatus(''), 2500);
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // The person closed the share sheet. Nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      flash('Link copied');
    } catch {
      flash('Could not copy the link');
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={handleShare}>
        Share
      </Button>
      <span className="share-status" role="status" aria-live="polite">
        {status}
      </span>
    </>
  );
}
