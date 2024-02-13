import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, TextField, Button } from "@mui/material";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useAdminProfileViewQuery,
} from "../../../services/userAuthApi";
import { getToken, removeToken } from "../../../services/LocalStorageService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUserToken } from "../../../features/authSlice";

function PasswordResetPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStep, setVerificationStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const dispatch = useDispatch();
  const [unauthorized, setUnauthorized] = useState(false);
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    const confirmationMessage = "Are you sure you want to leave this page?";

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const { data, refetch, isLoading, error } = useAdminProfileViewQuery({
    access_token,
  });
  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        dispatch(removeUserToken());
        removeToken();
        return navigate("/");
      }
    }
  }, [error]);

  const handleSendOTP = async () => {
    setLoading(true);
    setErrorMessage("");
    const response = await sendOTP({ access_token });
    if (response.data) {
      if (response.data.msg === "OTP sent via email") {
        setSuccessMessage(response.data.msg);
        setVerificationStep(2);
      }
    }

    if (response.error) {
      if (response.error.status === 401) {
        setUnauthorized(true);
      }
      setErrorMessage("Failed to send OTP");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (unauthorized) {
      dispatch(removeUserToken());
      removeToken();
      return navigate("/");
    }
  }, [unauthorized]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    setOtp("");
    setErrorMessage("");
    setSuccessMessage("");

    if (otp === "") {
      setErrorMessage("Please enter OTP");
      setLoading(false);
      return;
    }
    const response = await verifyOTP({ access_token, otp });

    if (response.error && response.error.status === 400) {
      if (response.error.data.error === "OTP has expired") {
        setErrorMessage(response.error.data.error);
        setTimeout(() => {
          setVerificationStep(1);
          setErrorMessage("");
          setSuccessMessage("Click to resend the OTP");
        }, 2000);
      } else {
        setErrorMessage(response.error.data.error);
      }
    }

    if (response.error && response.error.status === 401) {
      setUnauthorized(true);
    }

    if (response.data) {
      setSuccessMessage("OTP verified successfully");
      setVerificationStep(3);
    }

    setLoading(false);
  };
  const handleResetPassword = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword === "" || confirmPassword === "") {
      setErrorMessage("Please enter both new password and confirm password");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Password and Confirm Password don't match");
      setLoading(false);
      return;
    }

    // Define password pattern
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    // Check if the new password matches the pattern
    if (!passwordPattern.test(newPassword)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
      );
      setLoading(false);
      return;
    }
    const response = await resetPassword({
      access_token,
      actualData: { password: newPassword, password2: confirmPassword },
    });
    if (response.data) {
      if (response.data.msg === "Password Reset successfully") {
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage(response.data.msg);
        setTimeout(() => {
          dispatch(removeUserToken());
          removeToken();
          navigate("/");
        }, 3000);
      }
    }
    if (response.error) {
      if (response.error.status === 401) {
        setUnauthorized(true);
      }
      setErrorMessage("Failed to reset password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 py-6 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-md w-full space-y-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        style={{ marginBottom: "50px" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Password Reset
        </Typography>
        <div>
          {verificationStep === 1 && (
            <div>
              <Typography variant="h5">Receive OTP</Typography>
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                variant="contained"
                color="primary"
              >
                Receive OTP
              </Button>
            </div>
          )}
          {verificationStep === 2 && (
            <div>
              <Typography variant="h5">Verify OTP</Typography>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={loading}
                variant="contained"
                color="primary"
              >
                Verify OTP
              </Button>
            </div>
          )}
          {verificationStep === 3 && (
            <div>
              <Typography variant="h5">Reset Password</Typography>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button
                onClick={handleResetPassword}
                disabled={loading}
                variant="contained"
                color="primary"
              >
                Reset Password
              </Button>
            </div>
          )}
          {loading && <CircularProgress />}
          {errorMessage && (
            <Typography variant="subtitle1" style={{ color: "red" }}>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="subtitle1" style={{ color: "green" }}>
              {successMessage}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
