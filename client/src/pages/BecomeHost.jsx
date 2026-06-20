import { Link } from "react-router-dom";
import { DollarSign, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const BecomeHost = () => {
  const { isAuthenticated, user } = useAuth();
  const isHost = user?.role === "host" || user?.role === "admin";

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-ink text-balance">
          Turn your space into income
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60">
          Join thousands of hosts sharing their homes with travelers from around the world.
        </p>
        <Link
          to={isAuthenticated ? (isHost ? "/host/properties/new" : "/register") : "/register"}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition hover:bg-coral-dark"
        >
          {isHost ? "List your property" : "Get started"} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center">
          <DollarSign className="mx-auto h-8 w-8 text-coral" />
          <h3 className="mt-3 font-display text-lg font-medium text-ink">Earn extra income</h3>
          <p className="mt-1 text-sm text-ink/60">Set your own price and availability, on your terms.</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-coral" />
          <h3 className="mt-3 font-display text-lg font-medium text-ink">Booking protection</h3>
          <p className="mt-1 text-sm text-ink/60">Secure payments processed through Stripe.</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center">
          <Headphones className="mx-auto h-8 w-8 text-coral" />
          <h3 className="mt-3 font-display text-lg font-medium text-ink">Manage with ease</h3>
          <p className="mt-1 text-sm text-ink/60">A dashboard built for tracking bookings and earnings.</p>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
