import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, DollarSign, Star, Plus } from "lucide-react";
import api from "../../utils/api.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";
import Button from "../../components/ui/Button.jsx";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-ink/10 bg-white p-5">
    <div className="flex items-center gap-2 text-ink/50">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
  </div>
);

const HostDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [propsRes, bookingsRes] = await Promise.all([
          api.get("/properties/host/mine"),
          api.get("/bookings/host"),
        ]);
        setProperties(propsRes.data.properties);
        setBookings(bookingsRes.data.bookings);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageSpinner />;

  const confirmedBookings = bookings.filter((b) => ["confirmed", "completed"].includes(b.status));
  const totalEarnings = confirmedBookings.reduce(
    (sum, b) => sum + (b.priceBreakdown.total - b.priceBreakdown.serviceFee),
    0
  );
  const avgRating =
    properties.filter((p) => p.ratingsCount > 0).reduce((sum, p) => sum + p.ratingsAverage, 0) /
      (properties.filter((p) => p.ratingsCount > 0).length || 1) || 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Host dashboard</h1>
        <Link to="/host/properties/new">
          <Button variant="coral">
            <Plus className="h-4 w-4" /> New listing
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Home} label="Listings" value={properties.length} />
        <StatCard icon={Calendar} label="Bookings" value={bookings.length} />
        <StatCard icon={DollarSign} label="Earnings" value={`$${totalEarnings.toFixed(0)}`} />
        <StatCard icon={Star} label="Avg. rating" value={avgRating > 0 ? avgRating.toFixed(1) : "—"} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Your listings</h2>
            <Link to="/host/properties" className="text-sm font-medium text-coral">
              Manage all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {properties.slice(0, 4).map((p) => (
              <Link
                key={p._id}
                to={`/host/properties/${p._id}/edit`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-paper"
              >
                <img src={p.images?.[0]?.url} alt="" className="h-10 w-14 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-ink/50">${p.pricePerNight}/night</p>
                </div>
              </Link>
            ))}
            {properties.length === 0 && (
              <p className="text-sm text-ink/50">You haven't listed a property yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Recent bookings</h2>
            <Link to="/host/bookings" className="text-sm font-medium text-coral">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b._id} className="flex items-center justify-between rounded-lg p-2">
                <div>
                  <p className="text-sm font-medium text-ink">{b.property?.title}</p>
                  <p className="text-xs text-ink/50">{b.guest?.name}</p>
                </div>
                <span className="text-xs font-medium capitalize text-ink/60">{b.status}</span>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-sm text-ink/50">No bookings yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
