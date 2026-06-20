import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Compass } from "lucide-react";
import { loginUser } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const result = await dispatch(loginUser(form));
    setLoading(false);

    if (loginUser.fulfilled.match(result)) {
      dispatch(showToast({ message: `Welcome back, ${result.payload.user.name}!`, type: "success" }));
      navigate(location.state?.from?.pathname || "/");
    } else {
      setErrors({ form: result.payload });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Compass className="h-8 w-8 text-coral" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/50">Log in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          {errors.form && (
            <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{errors.form}</p>
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-ink/50 hover:text-coral">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="coral" className="w-full" loading={loading}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-coral">
            Sign up
          </Link>
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-ink/15 bg-white/50 p-4 text-xs text-ink/50">
          <p className="font-medium text-ink/70">Demo accounts (after seeding the database):</p>
          <p className="mt-1">guest1@example.com / Guest1234</p>
          <p>host1@example.com / Host1234</p>
          <p>admin@example.com / Admin1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
