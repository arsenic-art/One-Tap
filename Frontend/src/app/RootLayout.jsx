import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.jsx";
import Navbar from "../components/common/Navbar.jsx";

export default function RootLayout() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => {
        history.scrollRestoration = prev;
      };
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
