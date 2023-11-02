import React, { useState } from "react";

function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (newPassword === "" || confirmPassword === "") {
      setPasswordError("Please fill in both fields.");
    } else if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else {

      setPasswordChanged(true);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center my-4">Set New Password</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {passwordChanged ? (
          <p className="mt-4 text-center text-green-600">Password changed successfully!</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password:
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password:
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
            </div>
            {passwordError && (
              <p className="text-red-600">{passwordError}</p>
            )}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Set New Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NewPasswordForm;
