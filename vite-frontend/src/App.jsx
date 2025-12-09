import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import BookingsPage from "./pages/BookingsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import DashboardVenues from "./pages/dashboard/DashboardVenues";
import DashboardCaterings from "./pages/dashboard/DashboardCaterings";
import DashboardDishes from "./pages/dashboard/DashboardDishes";
import DashboardDecorations from "./pages/dashboard/DashboardDecorations";
import DashboardCars from "./pages/dashboard/DashboardCars";
import DashboardPromos from "./pages/dashboard/DashboardPromos";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.is_admin ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            user?.is_admin ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <SignupPage />
          )
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
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
    </Routes>
  );
}

export default App;
