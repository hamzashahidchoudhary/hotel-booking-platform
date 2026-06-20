import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar, Users } from "lucide-react";
import { createBooking } from "../store/bookingsSlice.js";
import { showToast } from "../store/uiSlice.js";
import { useAuth } from "../hooks/useAuth.js";
import Button from "./ui/Button.jsx";

const BookingWidget = ({ property, unavailableRanges = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [range, setRange] = useState();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const disabledDates = useMemo(
    () => [
      { before: new Date() },
      ...unavailableRanges.map((r) => ({ from: new Date(r.checkIn), to: new Date(r.checkOut) })),
      ...property.blockedDates?.map((d) => new Date(d)) || [],
    ],
    [unavailableRanges, property.blockedDates]
  );

  const nights =
    range?.from && range?.to
      ? Math.round((range.to - range.from) / (1000 * 60 * 60 * 24))
      : 0;

  const subtotal = nights * property.pricePerNight;
  const serviceFee = Math.round(subtotal * (property.serviceFeePercent / 100) * 100) / 100;
  const total = Math.round((subtotal + (property.cleaningFee || 0) + serviceFee) * 100) / 100;

  const handleBook = async () => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: "Log in to book this stay", type: "info" }));
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    if (!range?.from || !range?.to) {
      dispatch(showToast({ message: "Select your check-in and check-out dates", type: "error" }));
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createBooking({
        property: property._id,
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        guestsCount: { adults, children },
      })
    );
    setSubmitting(false);

    if (createBooking.fulfilled.match(result)) {
      navigate(`/bookings/${result.payload.booking._id}/checkout`);
    } else {
      dispatch(showToast({ message: result.payload, type: "error" }));
    }
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-lg shadow-ink/5">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-semibold text-ink">
          ${property.pricePerNight}
        </span>
        <span className="text-sm text-ink/50">/ night</span>
      </div>

      <div className="mt-4 rounded-xl border border-ink/15">
        <button
          onClick={() => setShowCalendar((s) => !s)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-coral" />
            {range?.from && range?.to ? (
              <span className="text-ink">
                {range.from.toLocaleDateString()} – {range.to.toLocaleDateString()}
              </span>
            ) : (
              <span className="text-ink/50">Select dates</span>
            )}
          </div>
        </button>

        {showCalendar && (
          <div className="border-t border-ink/10 p-3">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={disabledDates}
              numberOfMonths={1}
            />
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-ink/15 px-4 py-3">
          <Users className="h-4 w-4 text-coral" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm text-ink/70">Adults</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                className="h-6 w-6 rounded-full border border-ink/20 text-sm"
              >
                −
              </button>
              <span className="w-4 text-center text-sm">{adults}</span>
              <button
                onClick={() => setAdults((a) => Math.min(property.maxGuests, a + 1))}
                className="h-6 w-6 rounded-full border border-ink/20 text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-ink/15 px-4 py-3">
          <span className="w-4" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm text-ink/70">Children</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildren((c) => Math.max(0, c - 1))}
                className="h-6 w-6 rounded-full border border-ink/20 text-sm"
              >
                −
              </button>
              <span className="w-4 text-center text-sm">{children}</span>
              <button
                onClick={() => setChildren((c) => c + 1)}
                className="h-6 w-6 rounded-full border border-ink/20 text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-ink/40">Max {property.maxGuests} guests</p>

      {nights > 0 && (
        <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>
              ${property.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {property.cleaningFee > 0 && (
            <div className="flex justify-between text-ink/70">
              <span>Cleaning fee</span>
              <span>${property.cleaningFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink/70">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleBook}
        variant="coral"
        className="mt-5 w-full"
        loading={submitting}
        disabled={user?._id === property.host?._id}
      >
        {user?._id === property.host?._id ? "This is your property" : "Reserve"}
      </Button>
      <p className="mt-2 text-center text-xs text-ink/40">You won't be charged yet</p>
    </div>
  );
};

export default BookingWidget;
