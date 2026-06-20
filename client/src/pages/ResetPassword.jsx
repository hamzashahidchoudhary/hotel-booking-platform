import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Compass } from "lucide-react";
import api from "../utils/api.js";
import { useDispatch } from "react-redux";
import { showToast } from "../store/uiSlice.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.patch(`/auth/reset-password/${token}`, { password });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      dispatch(showToast({ message: "Password reset! You're logged in.", type: "success" }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Compass className="h-8 w-8 text-coral" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Set a new password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          {error && <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
          <Input
            label="New password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters, 1 uppercase, 1 number"
            required
          />
          <Button type="submit" variant="coral" className="w-full" loading={loading}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
