import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Calendar, CalendarCheck } from "lucide-react";
import { fetchHostBookings } from "../../store/bookingsSlice.js";
import { PageSpinner, EmptyState } from "../../components/ui/Feedback.jsx";

const STATUS_STYLES = {
  pending_payment: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const HostBookings = () => {
  const dispatch = useDispatch();
  const { hostBookings } = useSelector((state) => state.bookings);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    dispatch(fetchHostBookings(filter ? { status: filter } : {})).finally(() => setLoading(false));
  }, [filter, dispatch]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Bookings</h1>

      <div className="mt-4 flex gap-2">
        {["", "pending_payment", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === s ? "bg-ink text-paper" : "bg-white text-ink/60"
            }`}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : hostBookings.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No bookings found" />
        ) : (
          <div className="space-y-3">
            {hostBookings.map((b) => (
              <Link
                key={b._id}
                to={`/bookings/${b._id}`}
                className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4 hover:shadow-md"
              >
                <img src={b.property?.images?.[0]?.url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-display text-base font-medium text-ink">{b.property?.title}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">Guest: {b.guest?.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                    <Calendar className="h-3 w-3" />
                    {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-display text-lg font-semibold text-ink">
                  ${b.priceBreakdown.total.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookings;
