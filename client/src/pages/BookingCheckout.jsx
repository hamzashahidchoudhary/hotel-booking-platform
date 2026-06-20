import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, XCircle } from "lucide-react";
import { createCheckoutSession, fetchBookingById } from "../store/bookingsSlice.js";
import { showToast } from "../store/uiSlice.js";
import { PageSpinner } from "../components/ui/Feedback.jsx";
import Button from "../components/ui/Button.jsx";
import api from "../utils/api.js";

const BookingCheckout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const paymentResult = searchParams.get("payment"); // 'success' | 'cancelled' | null

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    };
    load();
  }, [id]);

  const handlePay = async () => {
    setRedirecting(true);
    const result = await dispatch(createCheckoutSession(id));
    if (createCheckoutSession.fulfilled.match(result)) {
      window.location.href = result.payload.url;
    } else {
      setRedirecting(false);
      dispatch(showToast({ message: result.payload, type: "error" }));
    }
  };

  if (!booking) return <PageSpinner />;

  if (paymentResult === "success") {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Booking confirmed!</h1>
        <p className="mt-2 text-sm text-ink/60">
          A confirmation email is on its way. We hope you have a wonderful stay.
        </p>
        <Button variant="coral" className="mt-6" onClick={() => navigate(`/bookings/${id}`)}>
          View booking
        </Button>
      </div>
    );
  }

  if (paymentResult === "cancelled") {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <XCircle className="mx-auto h-14 w-14 text-coral" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Payment cancelled</h1>
        <p className="mt-2 text-sm text-ink/60">
          Your booking is still reserved as pending. You can try paying again below.
        </p>
        <Button variant="coral" className="mt-6" onClick={handlePay} loading={redirecting}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Confirm and pay</h1>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-medium text-ink">{booking.property.title}</h2>
        <p className="mt-1 text-sm text-ink/60">
          {new Date(booking.checkIn).toLocaleDateString()} –{" "}
          {new Date(booking.checkOut).toLocaleDateString()} · {booking.nights} night
          {booking.nights > 1 ? "s" : ""}
        </p>

        <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>
              ${booking.priceBreakdown.pricePerNight} × {booking.nights} nights
            </span>
            <span>${booking.priceBreakdown.subtotal.toFixed(2)}</span>
          </div>
          {booking.priceBreakdown.cleaningFee > 0 && (
            <div className="flex justify-between text-ink/70">
              <span>Cleaning fee</span>
              <span>${booking.priceBreakdown.cleaningFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink/70">
            <span>Service fee</span>
            <span>${booking.priceBreakdown.serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
            <span>Total due now</span>
            <span>${booking.priceBreakdown.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button variant="coral" className="mt-6 w-full" onClick={handlePay} loading={redirecting}>
        Continue to secure payment
      </Button>
      <p className="mt-2 text-center text-xs text-ink/40">
        You'll be redirected to Stripe to complete your payment securely.
      </p>
    </div>
  );
};

export default BookingCheckout;
