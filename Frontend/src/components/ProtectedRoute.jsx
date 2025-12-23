import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
