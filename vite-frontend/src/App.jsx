import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "./store/slices/authSlice";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import HomePage from "./pages/HomePage";
import VenueDetailPage from "./pages/VenueDetailPage";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import VendorDashboardLayout from "./layouts/VendorDashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import DashboardVenues from "./pages/dashboard/DashboardVenues";
import DashboardCaterings from "./pages/dashboard/DashboardCaterings";
import DashboardDishes from "./pages/dashboard/DashboardDishes";
import DashboardDecorations from "./pages/dashboard/DashboardDecorations";
import DashboardCars from "./pages/dashboard/DashboardCars";
import DashboardPromos from "./pages/dashboard/DashboardPromos";
import VendorBookingsPage from "./pages/vendor/VendorBookingsPage";
import VenuesManagementPage from "./pages/vendor/VenuesManagementPage";
import CarsManagementPage from "./pages/vendor/CarsManagementPage";
import CateringsManagementPage from "./pages/vendor/CateringsManagementPage";
import PhotographyManagementPage from "./pages/vendor/PhotographyManagementPage";
import VendorEnquiriesPage from "./pages/vendor/VendorEnquiriesPage";
import VendorReviewsPage from "./pages/vendor/VendorReviewsPage";

function ProtectedRoute({ children, adminOnly = false, vendorOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  if (vendorOnly && user?.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  // Fetch user on app initialization if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [token, user, dispatch]);

  const getDefaultRoute = () => {
    if (!isAuthenticated) return null;
    if (user?.is_admin) return "/dashboard";
    if (user?.role === "vendor") {
      return `/dashboard/${user.vendor_type}`;
    }
    return "/";
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <LoginPage />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <SignupPage />
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/venues/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <VenueDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="venues" element={<DashboardVenues />} />
        <Route path="caterings" element={<DashboardCaterings />} />
        <Route path="dishes" element={<DashboardDishes />} />
        <Route path="decorations" element={<DashboardDecorations />} />
        <Route path="cars" element={<DashboardCars />} />
        <Route path="promos" element={<DashboardPromos />} />
      </Route>

      {/* Vendor Dashboard Routes */}
      <Route
        path="/dashboard/venue"
        element={
          <ProtectedRoute vendorOnly>
            <VendorDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="bookings" element={<VendorBookingsPage />} />
        <Route path="venues" element={<VenuesManagementPage />} />
        <Route path="enquiries" element={<VendorEnquiriesPage />} />
        <Route path="reviews" element={<VendorReviewsPage />} />
      </Route>

      <Route
        path="/dashboard/car_rental"
        element={
          <ProtectedRoute vendorOnly>
            <VendorDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="bookings" element={<VendorBookingsPage />} />
        <Route path="cars" element={<CarsManagementPage />} />
        <Route path="enquiries" element={<VendorEnquiriesPage />} />
      </Route>

      <Route
        path="/dashboard/catering"
        element={
          <ProtectedRoute vendorOnly>
            <VendorDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="bookings" element={<VendorBookingsPage />} />
        <Route path="caterings" element={<CateringsManagementPage />} />
        <Route path="enquiries" element={<VendorEnquiriesPage />} />
      </Route>

      <Route
        path="/dashboard/photography"
        element={
          <ProtectedRoute vendorOnly>
            <VendorDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="bookings" element={<VendorBookingsPage />} />
        <Route path="photography" element={<PhotographyManagementPage />} />
        <Route path="enquiries" element={<VendorEnquiriesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
