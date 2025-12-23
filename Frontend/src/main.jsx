import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { useAuthStore } from "./store/useAuthStore";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Root = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(<Root />);
