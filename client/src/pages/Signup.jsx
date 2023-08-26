import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function Signup({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
    setErrors({ ...errors, name: "" });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors({ ...errors, email: "" });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrors({ ...errors, password: "" });
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    if (name.trim() === "") {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const response = await axios.post(
          "https://updated-api-production.up.railway.app/api/v1/signupp",
          {
            name,
            email,
            password,
          }
        );

        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.token);
          localStorage.setItem("user_data", JSON.stringify(response.data.data));
          localStorage.setItem("userId", response.data.data.userId);
          setIsLoggedIn(true);
          navigate("/home");
        } else {
          console.log("Error:", response.data.error);
        }
      } catch (error) {
        if (
          (error.response && error.response.status === 400) ||
          (error.response && error.response.status === 422)
        ) {
          setErrors({
            ...newErrors,
            email: "Email address already registered.",
          });
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

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
        Signup
      </h1>
      <form
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSignup}
      >
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={handleNameChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Signup
        </Button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default Signup;
