import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const ForgotPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [data, setData] = useState("");
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSendingEmail(true);
      const res = await axios.post(
        "https://itcom.up.railway.app/api/v1/forgot-password",
        {
          email,
        }
      );
      console.log(res)
      // console.log("FORGOT password", res.data);
      setShowOtpField(true);
      setIsSendingEmail(false);
    } catch (error) {
      setIsSendingEmail(false);
      console.error("An error occurred:", error);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsVerifyingOtp(true);
      const response = await axios.post(
        "https://itcom.up.railway.app/v1/verify-otp",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        // console.log(response);
        setResetSuccess(true);
        setUserId(response.data.data.userId);
      }
      setIsVerifyingOtp(false);
    } catch (error) {
      setIsVerifyingOtp(false);
      console.error("An error occurred:", error);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `https://itcom.up.railway.app/api/v1/reset-password/${userId}`, // Use the userId to reset the password
        {
          newPassword,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        nav("/login");
        // console.log("Password reset successful!", response.data.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        // background: "linear-gradient(to bottom, #gray, #gray)",
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h5" align="center" gutterBottom>
          {resetSuccess ? "Reset Password" : ""}
        </Typography>
        {!showOtpField ? (
          <form onSubmit={handleEmailSubmit}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<EmailIcon />}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? <CircularProgress size={20} /> : "Send OTP"}
            </Button>
          </form>
        ) : !resetSuccess ? (
          <form onSubmit={handleOtpSubmit}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">
                We've sent an OTP to your email. Please enter the code below to
                verify your account.
              </Typography>
            </div>
            <TextField
              label="Enter OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? (
                <CircularProgress size={20} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <TextField
              label="New Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
};

export default ForgotPassword;
