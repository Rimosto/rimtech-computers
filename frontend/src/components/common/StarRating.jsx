export default function StarRating({ rating }) {
  const value = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));

  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'star on' : 'star'} aria-hidden="true">
          &#9733;
        </span>
      ))}
    </span>
  );
}
