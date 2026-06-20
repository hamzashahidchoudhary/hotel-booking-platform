import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Compass } from "lucide-react";
import { registerUser } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.password.length < 8) {
      setErrors({ form: "Password must be at least 8 characters" });
      return;
    }

    setLoading(true);
    const result = await dispatch(registerUser(form));
    setLoading(false);

    if (registerUser.fulfilled.match(result)) {
      dispatch(showToast({ message: "Account created! Welcome to Wayfare.", type: "success" }));
      navigate("/");
    } else {
      setErrors({ form: result.payload });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Compass className="h-8 w-8 text-coral" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/50">Start exploring stays around the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          {errors.form && (
            <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{errors.form}</p>
          )}
          <Input
            label="Full name"
            name="name"
            icon={UserIcon}
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />
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
            placeholder="At least 8 characters, 1 uppercase, 1 number"
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">I want to...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "user" })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  form.role === "user" ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/70"
                }`}
              >
                Book stays
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "host" })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  form.role === "host" ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/70"
                }`}
              >
                Host my place
              </button>
            </div>
          </div>

          <Button type="submit" variant="coral" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-coral">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
