import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PasswordResetPage = () => {
  // State variables
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user_id, setUserId] = useState("");
  const [verificationStep, setVerificationStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Function to handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(""); // Reset error state
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/send_otp_email/forget/password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (
          response.status === 403 &&
          data.error === "Permission denied. Your not Admin"
        ) {
          setError("Permission denied. You are not an admin.");
        } else {
          setError(data.error || "Error sending OTP. Please try again.");
        }
        return;
      }

      const data = await response.json();
      setUserId(data.user_id);
      setVerificationStep(2);
      setSuccessMessage(data.msg);
    } catch (error) {
      setError("Error sending OTP. Please try again.");
    }
  };

  // Function to handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      setError(""); // Reset error state
      setSuccessMessage("");
      setOtp("");
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/otp_verification/forget/password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id, otp }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (data.error === "OTP has expired. Please,re-enter your email.") {
          // OTP has expired
          setTimeout(() => {
            setError(data.error);
            setVerificationStep(1);
            setEmail("");
          }, 3000);
        } else {
          setError(data.error);
        }
        return;
      }

      await response.json();
      setVerificationStep(3);
      setSuccessMessage(
        "OTP verified successfully. Now, set your new password."
      );
    } catch (error) {
      setError("Incorrect OTP. Please try again.");
    }
  };

  // Function to handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Define password pattern
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    // Check if the new password matches the pattern
    if (!passwordPattern.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
      );

      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please enter matching passwords.");
      return;
    }

    try {
      setError(""); // Reset error state
      setSuccessMessage("");
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/change_password/forget/password/${user_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
            password2: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("Password changed successfully.");

        const timeoutId = setTimeout(() => {
          navigate("/");
        }, 3000);

        return () => clearTimeout(timeoutId); // Clear the timeout on component unmount
      } else {
        setError(data.error || "Error changing password. Please try again.");
      }
    } catch (error) {
      setError("Error changing password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Password Reset
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={
            verificationStep === 1
              ? handleEmailSubmit
              : verificationStep === 2
              ? handleOtpVerification
              : handlePasswordChange
          }
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {verificationStep === 1 && (
              <>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}
            {verificationStep === 2 && (
              <>
                <div>
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="otp"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </>
            )}
            {verificationStep === 3 && (
              <>
                <div>
                  <label htmlFor="new-password" className="sr-only">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="confirm-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              {verificationStep === 1 &&
                !error &&
                !successMessage &&
                "Enter your registered email."}
            </div>
            <div className="text-red-500">{error}</div>
            <div className="text-green-500">{successMessage}</div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {verificationStep === 1
                ? "Send OTP"
                : verificationStep === 2
                ? "Verify OTP"
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
