const LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Satisfied'];

export default function StarRating({
  value = 0,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`stars-wrap stars-${size}`}>
      <div className={`stars ${interactive ? 'stars-interactive' : ''}`} role="img" aria-label={`${value} out of 5 stars`}>
        {stars.map((star) => {
          const filled = value >= star;
          const half = !filled && value >= star - 0.5;
          return (
            <button
              key={star}
              type="button"
              className={`star ${filled ? 'filled' : ''} ${half ? 'half' : ''}`}
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              aria-label={`${star} star`}
            >
              ★
            </button>
          );
        })}
      </div>
      {showLabel && interactive && (
        <span className="rating-label">{LABELS[Math.max(0, Math.min(4, Math.round(value) - 1))]}</span>
      )}
    </div>
  );
}
