import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newError = {
      email: "",
      password: "",
    };

    if (email.trim() === "") {
      newError.email = "Email is required";
      isValid = false;
    }

    if (password.trim() === "") {
      newError.password = "Password is required";
      isValid = false;
    }

    setError(newError);
    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post("https://updated-api-production.up.railway.app/api/v1/login", {
        email,
        password,
      });

      const { status, token, data } = response.data;

      if (status === 200) {
        localStorage.setItem("user_data", JSON.stringify(data));

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("access_token", token);
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setError({
          email: "Invalid email or password",
          password: "Invalid email or password",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        } else if (error.response.status === 404) {
          setError({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        }
      }
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1
        style={{ marginBottom: "20px", fontSize: "28px", fontWeight: "bold" }}
      >
        Login
      </h1>
      <form
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError({ ...error, email: "" });
          }}
          error={Boolean(error.email)}
          helperText={error.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError({ ...error, password: "" });
          }}
          error={Boolean(error.password)}
          helperText={error.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Login
        </Button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
      <p style={{ marginTop: "10px" }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
};

export default Login;
