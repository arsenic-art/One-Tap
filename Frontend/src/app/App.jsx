import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./RootLayout";
import Homepage from "../pages/Homepage";
import Services from "../features/services/Services";
import Support from "../pages/Support";
import LogSign from "../features/auth/LoginSignup";
import AboutUsPage from "../pages/AboutUs";
import ForgotPasswordPage from "../features/auth/ForgotPassword";
import AddMechanicPage from "../features/mechanic/AddMechanic";
import AdminDashboard from "../features/admin/AdminDashboard";
import FeedPage from "../pages/Feed";
import BrowseMechanics from "../features/mechanic/BrowseMechanics";
import ServiceRequestPage from "../features/services/ServiceRequestPage";
import {
  ProtectedUserRoute as ProtectedRoute,
  ProtectedMechanicRoute,
  ProtectedAnyUserRoute,
} from "../components/common/ProtectedRoute";
import MyBooking from "../features/bookings/MyBookings";
import ProfilePage from "../features/profile/ProfilePage";
import ProfileEditPage from "../features/profile/ProfileEditPage";
import MechanicDashboard from "../features/mechanic/Dashboard";
import AddressManagement from "../features/profile/AddressManagement";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Homepage key="home" /> },
      { path: "signup", element: <LogSign signUp={false} key="signup" /> },
      { path: "login", element: <LogSign signUp={true} key="login" /> },
      { path: "forgot-password", element: <ForgotPasswordPage key="forgot" /> },

      {
        path: "services",
        element: (
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        ),
      },
      {
        path: "addresses",
        element: (
          <ProtectedRoute>
            <AddressManagement />
          </ProtectedRoute>
        ),
      },
      { path: "support", element: <Support /> },
      { path: "aboutus", element: <AboutUsPage /> },

      {
        path: "addmechanic",
        element: (
          <ProtectedMechanicRoute>
            <AddMechanicPage />
          </ProtectedMechanicRoute>
        ),
      },
      {
        path: "adminn",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "feed",
        element: (
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "browse",
        element: (
          <ProtectedAnyUserRoute>
            <BrowseMechanics />
          </ProtectedAnyUserRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <MyBooking />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedMechanicRoute>
            <MechanicDashboard />
          </ProtectedMechanicRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedAnyUserRoute>
            <ProfilePage />
          </ProtectedAnyUserRoute>
        ),
      },

      {
        path: "profile/edit",
        element: (
          <ProtectedAnyUserRoute>
            <ProfileEditPage />
          </ProtectedAnyUserRoute>
        ),
      },

      {
        path: "service-request/:mechanicId",
        element: (
          <ProtectedRoute>
            <ServiceRequestPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
