import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Users } from "lucide-react";
import { fetchBookingById, cancelBooking } from "../store/bookingsSlice.js";
import { showToast } from "../store/uiSlice.js";
import { useAuth } from "../hooks/useAuth.js";
import { PageSpinner } from "../components/ui/Feedback.jsx";
import Button from "../components/ui/Button.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

const STATUS_STYLES = {
  pending_payment: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const BookingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { current: booking, status } = useSelector((state) => state.bookings);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [id, dispatch]);

  if (status === "loading" || !booking) return <PageSpinner />;

  const isGuest = booking.guest._id === user._id;

  const handleCancel = async () => {
    if (reason.trim().length < 3) {
      dispatch(showToast({ message: "Please provide a reason for cancellation", type: "error" }));
      return;
    }
    setCancelling(true);
    const result = await dispatch(cancelBooking({ id, cancellationReason: reason }));
    setCancelling(false);
    if (cancelBooking.fulfilled.match(result)) {
      dispatch(showToast({ message: "Booking cancelled", type: "success" }));
      setShowCancelForm(false);
    } else {
      dispatch(showToast({ message: result.payload, type: "error" }));
    }
  };

  const canCancel = ["pending_payment", "confirmed"].includes(booking.status);
  const canReview = isGuest && booking.status === "completed" && !booking.reviewed && !reviewed;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Booking details</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <Link to={`/properties/${booking.property._id}`} className="font-display text-lg font-medium text-ink hover:text-coral">
          {booking.property.title}
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink/50">
          <MapPin className="h-3.5 w-3.5" />
          {booking.property.location?.city}, {booking.property.location?.country}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-ink/10 pt-4 text-sm">
          <div>
            <p className="flex items-center gap-1 text-xs uppercase text-ink/40">
              <Calendar className="h-3.5 w-3.5" /> Check-in
            </p>
            <p className="mt-1 text-ink">{new Date(booking.checkIn).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs uppercase text-ink/40">
              <Calendar className="h-3.5 w-3.5" /> Check-out
            </p>
            <p className="mt-1 text-ink">{new Date(booking.checkOut).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs uppercase text-ink/40">
              <Users className="h-3.5 w-3.5" /> Guests
            </p>
            <p className="mt-1 text-ink">
              {booking.guestsCount.adults} adult{booking.guestsCount.adults > 1 ? "s" : ""}
              {booking.guestsCount.children > 0 && `, ${booking.guestsCount.children} children`}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-ink/40">{isGuest ? "Host" : "Guest"}</p>
            <p className="mt-1 text-ink">{isGuest ? booking.host.name : booking.guest.name}</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>${booking.priceBreakdown.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Fees</span>
            <span>
              ${(booking.priceBreakdown.cleaningFee + booking.priceBreakdown.serviceFee).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
            <span>Total</span>
            <span>${booking.priceBreakdown.total.toFixed(2)}</span>
          </div>
        </div>

        {booking.status === "pending_payment" && isGuest && (
          <Link to={`/bookings/${booking._id}/checkout`}>
            <Button variant="coral" className="mt-5 w-full">
              Complete payment
            </Button>
          </Link>
        )}

        {booking.status === "cancelled" && (
          <div className="mt-4 rounded-lg bg-paper px-4 py-3 text-sm text-ink/60">
            <p>Cancelled: {booking.cancellationReason}</p>
            <p className="mt-1">Refund amount: ${booking.refundAmount.toFixed(2)}</p>
          </div>
        )}

        {canCancel && (
          <div className="mt-5 border-t border-ink/10 pt-5">
            {!showCancelForm ? (
              <Button variant="danger" onClick={() => setShowCancelForm(true)}>
                Cancel booking
              </Button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  rows={3}
                  className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button variant="danger" onClick={handleCancel} loading={cancelling}>
                    Confirm cancellation
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCancelForm(false)}>
                    Never mind
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {canReview && (
        <div className="mt-6">
          <ReviewForm bookingId={booking._id} onSubmitted={() => setReviewed(true)} />
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
