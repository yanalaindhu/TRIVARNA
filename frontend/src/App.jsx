import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <AppRoutes />;
}

export default App;