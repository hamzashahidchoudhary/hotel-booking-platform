import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Wrap any route that requires authentication. Optionally restrict by role(s).
// Usage: <ProtectedRoute roles={['host', 'admin']}><HostDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, initialCheckDone } = useAuth();
  const location = useLocation();

  // Wait for the initial /auth/me check before deciding to redirect,
  // otherwise a refresh on a protected page would briefly bounce to /login.
  if (!initialCheckDone) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-coral" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
