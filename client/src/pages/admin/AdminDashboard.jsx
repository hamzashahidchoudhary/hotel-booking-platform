import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, Home, Calendar, DollarSign, Star, ShieldAlert } from "lucide-react";
import api from "../../utils/api.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-ink/10 bg-white p-5">
    <div className="flex items-center gap-2 text-ink/50">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) return <PageSpinner />;

  const chartData = stats.monthlyTrend.map((m) => ({
    month: MONTH_NAMES[m._id.month - 1],
    bookings: m.count,
    revenue: Math.round(m.revenue),
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Admin dashboard</h1>
        <div className="flex gap-3 text-sm">
          <Link to="/admin/users" className="font-medium text-coral">Users</Link>
          <Link to="/admin/properties" className="font-medium text-coral">Properties</Link>
          <Link to="/admin/bookings" className="font-medium text-coral">Bookings</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Users" value={stats.totalUsers} />
        <StatCard icon={Home} label="Hosts" value={stats.totalHosts} />
        <StatCard icon={Calendar} label="Properties" value={stats.totalProperties} />
        <StatCard icon={ShieldAlert} label="Active listings" value={stats.activeProperties} />
        <StatCard icon={Calendar} label="Total bookings" value={stats.totalBookings} />
        <StatCard icon={Calendar} label="Confirmed" value={stats.confirmedBookings} />
        <StatCard icon={DollarSign} label="Total revenue" value={`$${stats.totalRevenue.toFixed(0)}`} />
        <StatCard icon={DollarSign} label="Platform earnings" value={`$${stats.platformEarnings.toFixed(0)}`} />
      </div>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-medium text-ink">Booking trend (last 6 months)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12172B10" />
              <XAxis dataKey="month" stroke="#12172B60" fontSize={12} />
              <YAxis stroke="#12172B60" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#FF6B4A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
