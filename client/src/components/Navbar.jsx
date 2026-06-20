import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu, X, Compass, User, Heart, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { logoutUser } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(showToast({ message: "You've been signed out", type: "info" }));
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-coral" strokeWidth={2.2} />
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Wayfare
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/search" className="text-sm font-medium text-ink/70 hover:text-ink">
            Explore stays
          </Link>
          {user?.role === "host" || user?.role === "admin" ? (
            <Link to="/host/dashboard" className="text-sm font-medium text-ink/70 hover:text-ink">
              Host dashboard
            </Link>
          ) : (
            <Link to="/become-a-host" className="text-sm font-medium text-ink/70 hover:text-ink">
              Become a host
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 shadow-sm hover:shadow"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-ink">{user.name?.split(" ")[0]}</span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-ink/10 bg-white py-2 shadow-xl shadow-ink/10">
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-paper"
                    >
                      <User className="h-4 w-4" /> My account
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-paper"
                    >
                      <Compass className="h-4 w-4" /> My trips
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-paper"
                    >
                      <Heart className="h-4 w-4" /> Saved stays
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-paper"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                      </Link>
                    )}
                    <hr className="my-2 border-ink/5" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-coral hover:bg-paper"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-ink hover:text-coral">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-coral"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-ink/5 bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/search" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
              Explore stays
            </Link>
            {user?.role === "host" || user?.role === "admin" ? (
              <Link to="/host/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                Host dashboard
              </Link>
            ) : (
              <Link to="/become-a-host" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                Become a host
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                  My account
                </Link>
                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                  My trips
                </Link>
                <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                  Saved stays
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-coral">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-coral">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
