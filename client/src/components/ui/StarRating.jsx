import { Star } from "lucide-react";

const StarRating = ({ value = 0, onChange, size = "h-5 w-5", readOnly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`${size} ${
              n <= Math.round(value) ? "fill-gold text-gold" : "fill-transparent text-ink/20"
            } transition`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
