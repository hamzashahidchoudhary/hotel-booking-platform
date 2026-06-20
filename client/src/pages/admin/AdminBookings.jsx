import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";

const STATUS_STYLES = {
  pending_payment: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/bookings", { params: { status: statusFilter } });
        setBookings(res.data.bookings);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">All bookings</h1>

      <div className="mt-4 flex gap-2">
        {["", "pending_payment", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              statusFilter === s ? "bg-ink text-paper" : "bg-white text-ink/60"
            }`}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-xs uppercase text-ink/40">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Host</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-ink/5">
                    <td className="px-4 py-3">
                      <Link to={`/bookings/${b._id}`} className="font-medium text-ink hover:text-coral">
                        {b.property?.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{b.guest?.name}</td>
                    <td className="px-4 py-3 text-ink/60">{b.host?.name}</td>
                    <td className="px-4 py-3 text-ink/50">
                      {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-ink">${b.priceBreakdown.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[b.status]}`}>
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
