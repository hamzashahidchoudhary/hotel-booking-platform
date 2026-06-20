import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-ink/5 bg-ink text-paper/80">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-coral" />
              <span className="font-display text-xl font-semibold text-paper">Wayfare</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-paper/60">
              Find a place that feels like yours, anywhere in the world. Built as a portfolio
              project demonstrating a full booking platform experience.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-paper">Explore</h4>
            <ul className="space-y-2 text-sm text-paper/60">
              <li><Link to="/search" className="hover:text-coral">All stays</Link></li>
              <li><Link to="/become-a-host" className="hover:text-coral">Become a host</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-paper">Account</h4>
            <ul className="space-y-2 text-sm text-paper/60">
              <li><Link to="/login" className="hover:text-coral">Log in</Link></li>
              <li><Link to="/register" className="hover:text-coral">Sign up</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-paper/10 pt-6 text-xs text-paper/40">
          © {new Date().getFullYear()} Wayfare. A demo project — not a real booking service.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
