import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

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
      <Outlet />
    </>
  );
}
