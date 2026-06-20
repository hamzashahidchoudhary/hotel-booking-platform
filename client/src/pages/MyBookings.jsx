import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Calendar, MapPin, CalendarX } from "lucide-react";
import { fetchMyBookings } from "../store/bookingsSlice.js";
import { PageSpinner, EmptyState } from "../components/ui/Feedback.jsx";

const STATUS_STYLES = {
  pending_payment: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const TABS = [
  { value: "", label: "All" },
  { value: "confirmed", label: "Upcoming" },
  { value: "completed", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

const MyBookings = () => {
  const dispatch = useDispatch();
  const { myBookings } = useSelector((state) => state.bookings);
  const [tab, setTab] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchMyBookings(tab ? { status: tab } : {})).finally(() => setLoading(false));
  }, [tab, dispatch]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">My trips</h1>

      <div className="mt-6 flex gap-2 border-b border-ink/10">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.value ? "border-coral text-ink" : "border-transparent text-ink/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : myBookings.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No trips here yet"
            description="When you book a stay, it'll show up here."
            action={
              <Link to="/search" className="text-sm font-medium text-coral">
                Explore stays
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {myBookings.map((booking) => (
              <Link
                key={booking._id}
                to={`/bookings/${booking._id}`}
                className="flex gap-4 rounded-xl border border-ink/10 bg-white p-4 transition hover:shadow-md"
              >
                <img
                  src={booking.property?.images?.[0]?.url}
                  alt=""
                  className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-base font-medium text-ink">
                      {booking.property?.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                    <MapPin className="h-3 w-3" /> {booking.property?.location?.city}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                    <Calendar className="h-3 w-3" />
                    {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    ${booking.priceBreakdown.total.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
