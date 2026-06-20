import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Compass, CheckCircle2 } from "lucide-react";
import api from "../utils/api.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Compass className="h-8 w-8 text-coral" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-1 text-center text-sm text-ink/50">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="mt-3 text-sm text-ink/70">
                If an account exists for <strong>{email}</strong>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
              )}
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" variant="coral" className="w-full" loading={loading}>
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          <Link to="/login" className="font-medium text-coral">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
