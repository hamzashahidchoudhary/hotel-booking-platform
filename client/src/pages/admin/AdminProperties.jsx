import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/uiSlice.js";
import api from "../../utils/api.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";

const AdminProperties = () => {
  const dispatch = useDispatch();
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/properties", { params: { status: statusFilter } });
      setProperties(res.data.properties);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/properties/${id}/status`, { status });
      load();
      dispatch(showToast({ message: `Listing ${status}`, type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed", type: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Moderate properties</h1>

      <div className="mt-4 flex gap-2">
        {["", "published", "suspended", "draft"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              statusFilter === s ? "bg-ink text-paper" : "bg-white text-ink/60"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : (
          <div className="space-y-3">
            {properties.map((p) => (
              <div key={p._id} className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4">
                <img src={p.images?.[0]?.url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/properties/${p._id}`} className="truncate font-display text-base font-medium text-ink hover:text-coral">
                    {p.title}
                  </Link>
                  <p className="text-sm text-ink/50">Host: {p.host?.name} ({p.host?.email})</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      p.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "suspended"
                        ? "bg-red-100 text-red-700"
                        : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                {p.status === "published" ? (
                  <button
                    onClick={() => handleStatusChange(p._id, "suspended")}
                    className="rounded-full border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral hover:bg-coral/5"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(p._id, "published")}
                    className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;
