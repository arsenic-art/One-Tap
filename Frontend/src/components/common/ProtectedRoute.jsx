import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useMechanicAuthStore } from "../../store/useAuthStore";

const ProtectedUserRoute = ({ children }) => {
  const { isLoggedIn, isCheckingAuth, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedMechanicRoute = ({ children }) => {
  const { isLoggedIn, isCheckingAuth, mechanic, checkAuth } =
    useMechanicAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-medium">
          Checking mechanic authentication...
        </p>
      </div>
    );
  }

  if (!isLoggedIn || !mechanic) {
    return <Navigate to="/login" replace />;
  }

  if (mechanic.role !== "mechanic") {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

const ProtectedAnyUserRoute = ({ children }) => {
  const {
    isLoggedIn: userLoggedIn,
    isCheckingAuth: userChecking,
    checkAuth: checkUser,
  } = useAuthStore();
  const {
    isLoggedIn: mechanicLoggedIn,
    isCheckingAuth: mechanicChecking,
    checkAuth: checkMechanic,
  } = useMechanicAuthStore();

  useEffect(() => {
    checkUser();
    checkMechanic();
  }, [checkUser, checkMechanic]);

  const isCheckingAuth = userChecking || mechanicChecking;
  const isLoggedIn = userLoggedIn || mechanicLoggedIn;

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export { ProtectedMechanicRoute, ProtectedUserRoute, ProtectedAnyUserRoute };
