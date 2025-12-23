import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./RootLayout";
import Homepage from "./pages/Homepage";
import Services from "./components/Services";
import Support from "./components/Support";
import LogSign from "./components/LogSign";
import AboutUsPage from "./components/AboutUs";
import ForgotPasswordPage from "./components/ForgotPassword";
import AddMechanicPage from "./components/AddMechanic";
import AdminDashboard from "./components/AdminDashboard";
import FeedPage from "./components/Feed";
import BrowseMechanics from "./components/BrowseMechanics";
import ServiceRequestPage from "./components/ServiceRequestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBooking from "./components/MyBookings";
import ProfilePage from "./components/ProfilePage";
import ProfileEditPage from "./components/ProfileEditPage";

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
      { path: "support", element: <Support /> },
      { path: "aboutus", element: <AboutUsPage /> },

      {
        path: "addmechanic",
        element: (
          <ProtectedRoute>
            <AddMechanicPage />
          </ProtectedRoute>
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
          <ProtectedRoute>
            <BrowseMechanics />
          </ProtectedRoute>
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
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
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
