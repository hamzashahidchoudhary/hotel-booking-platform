import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
import api from "../../utils/api.js";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/uiSlice.js";
import { PageSpinner } from "../../components/ui/Feedback.jsx";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", { params: { search, role } });
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      load();
    } catch (err) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed", type: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Manage users</h1>

      <div className="mt-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="user">Guests</option>
          <option value="host">Hosts</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <PageSpinner />
        ) : (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-xs uppercase text-ink/40">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-ink/5">
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-ink/60">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-ink/60">{u.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleToggleActive(u._id)}
                          className={`text-xs font-medium ${u.isActive ? "text-coral" : "text-emerald-600"}`}
                        >
                          {u.isActive ? (
                            <span className="flex items-center gap-1"><Ban className="h-3.5 w-3.5" /> Deactivate</span>
                          ) : (
                            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Activate</span>
                          )}
                        </button>
                      )}
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

export default AdminUsers;
