import { useEffect, useState } from "react";
import api from "../utils/api.js";
import StarRating from "./ui/StarRating.jsx";
import { Spinner } from "./ui/Feedback.jsx";

const ReviewsList = ({ propertyId, ratingsAverage, ratingsCount }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reviews/property/${propertyId}`, { params: { page } });
        setReviews(res.data.reviews);
        setPages(res.data.pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [propertyId, page]);

  if (loading && page === 1) return <Spinner className="h-6 w-6" />;

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <StarRating value={ratingsAverage} readOnly size="h-5 w-5" />
        <span className="font-display text-lg font-medium text-ink">
          {ratingsAverage?.toFixed(1) || "New"}
        </span>
        <span className="text-sm text-ink/50">· {ratingsCount} review{ratingsCount !== 1 ? "s" : ""}</span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-ink/50">No reviews yet. Be the first to stay and share your experience.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-xl border border-ink/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper">
                  {review.guest?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{review.guest?.name}</p>
                  <p className="text-xs text-ink/40">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <StarRating value={review.ratings.overall} readOnly size="h-3.5 w-3.5" />
              <p className="mt-2 text-sm text-ink/70">{review.comment}</p>

              {review.hostReply?.comment && (
                <div className="mt-3 rounded-lg bg-paper px-3 py-2">
                  <p className="text-xs font-medium text-ink/60">Response from host</p>
                  <p className="mt-1 text-sm text-ink/70">{review.hostReply.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-full text-sm ${
                page === p ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
