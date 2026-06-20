import { useState } from "react";
import api from "../utils/api.js";
import StarRating from "./ui/StarRating.jsx";
import Button from "./ui/Button.jsx";

const ReviewForm = ({ bookingId, onSubmitted }) => {
  const [overall, setOverall] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (comment.trim().length < 10) {
      setError("Please write at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/reviews", {
        booking: bookingId,
        ratings: { overall },
        comment,
      });
      onSubmitted(res.data.review);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white p-6">
      <h3 className="font-display text-lg font-medium text-ink">Leave a review</h3>
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
      <div className="mt-4">
        <StarRating value={overall} onChange={setOverall} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was your stay?"
        rows={4}
        className="mt-4 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
      <Button type="submit" variant="coral" className="mt-4" loading={submitting}>
        Submit review
      </Button>
    </form>
  );
};

export default ReviewForm;
