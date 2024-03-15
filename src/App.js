import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Suspense, useMemo } from "react"; // Import Suspense
import React from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { NotificationContainer } from "react-notifications";

// Lazy load your components
const HomePage = React.lazy(() => import("scenes/homePage"));
const LoginPage = React.lazy(() => import("scenes/loginPage"));
const Pregister = React.lazy(() => import("scenes/PregisterPage"));
const ProfilePage = React.lazy(() => import("scenes/profilePage"));

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <NotificationContainer />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Pregister />} />
              <Route path="/:tok" element={<LoginPage />} />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
