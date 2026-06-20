import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { fetchCurrentUser } from "./store/authSlice.js";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Search from "./pages/Search.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import BookingCheckout from "./pages/BookingCheckout.jsx";
import BookingDetail from "./pages/BookingDetail.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Favorites from "./pages/Favorites.jsx";
import Account from "./pages/Account.jsx";
import BecomeHost from "./pages/BecomeHost.jsx";
import HostDashboard from "./pages/host/HostDashboard.jsx";
import HostProperties from "./pages/host/HostProperties.jsx";
import HostPropertyForm from "./pages/host/HostPropertyForm.jsx";
import HostBookings from "./pages/host/HostBookings.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search" element={<Search />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/become-a-host" element={<BecomeHost />} />

        <Route
          path="/bookings/:id/checkout"
          element={
            <ProtectedRoute>
              <BookingCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* Host routes */}
        <Route
          path="/host/dashboard"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/properties"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/properties/new"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostPropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/properties/:id/edit"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostPropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/bookings"
          element={
            <ProtectedRoute roles={["host", "admin"]}>
              <HostBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
