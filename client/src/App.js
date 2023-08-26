import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8002/api/v1/signout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("An error occurred while signing out:", error);
    }
  };
  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Signup setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Signup setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
const NotFound = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography
        variant="h2"
        style={{
          color: "red",
          animation: "move 2s infinite",
        }}
      >
        <span style={{ color: "red" }}>404</span> - Page Not Found!
      </Typography>
      <style>
        {`
          @keyframes move {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default App;
