import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, EyeOff, Eye, Home } from "lucide-react";
import { fetchMyProperties, deleteProperty } from "../../store/propertiesSlice.js";
import { showToast } from "../../store/uiSlice.js";
import { PageSpinner, EmptyState } from "../../components/ui/Feedback.jsx";
import Button from "../../components/ui/Button.jsx";
import api from "../../utils/api.js";
import { useState } from "react";

const HostProperties = () => {
  const dispatch = useDispatch();
  const { myProperties } = useSelector((state) => state.properties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchMyProperties()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    const result = await dispatch(deleteProperty(id));
    if (deleteProperty.fulfilled.match(result)) {
      dispatch(showToast({ message: "Listing deleted", type: "success" }));
    } else {
      dispatch(showToast({ message: result.payload, type: "error" }));
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/properties/${id}/toggle-active`);
      dispatch(fetchMyProperties());
    } catch {
      dispatch(showToast({ message: "Failed to update listing", type: "error" }));
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Your listings</h1>
        <Link to="/host/properties/new">
          <Button variant="coral">
            <Plus className="h-4 w-4" /> New listing
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        {myProperties.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No listings yet"
            description="Create your first listing to start hosting guests."
            action={
              <Link to="/host/properties/new">
                <Button variant="coral">Create listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {myProperties.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-4"
              >
                <img src={p.images?.[0]?.url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-medium text-ink">{p.title}</p>
                  <p className="text-sm text-ink/50">
                    {p.location.city}, {p.location.country} · ${p.pricePerNight}/night
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {p.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(p._id)}
                    title={p.isActive ? "Pause listing" : "Activate listing"}
                    className="rounded-lg p-2 text-ink/60 hover:bg-paper"
                  >
                    {p.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    to={`/host/properties/${p._id}/edit`}
                    className="rounded-lg p-2 text-ink/60 hover:bg-paper"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="rounded-lg p-2 text-coral hover:bg-coral/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostProperties;
