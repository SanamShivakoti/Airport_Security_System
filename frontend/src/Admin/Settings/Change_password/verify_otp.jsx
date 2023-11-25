import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useSendOTPMutation } from "../../../services/userAuthApi";
import { getToken } from "../../../services/LocalStorageService";
function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Track whether OTP has been sent
  const navigate = useNavigate();
  const {access_token} = getToken();


  const [sendotp,res] = useSendOTPMutation();
  const otpSend = async(access_token) =>{
    try{
      const response = await sendotp({access_token});
      setOtpSent(true);
      setVerificationStatus("OTP of 6 digits has been sent to your email.")
    } catch (error) {

    }
  }
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    
    const mockOtp = "123456"; 
    if (otp === mockOtp) {
      setVerificationStatus("Verified!");
      
      navigate("/Admin/settings/set/newpassword");
      
    } else {
      setVerificationStatus("Incorrect OTP. Please try again.");
    }
  };

  const handleResendOtp = () => {

    setOtpSent(true);
    setVerificationStatus("OTP of 6 digits has been sent to your email.");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center my-4">OTP Verification</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {otpSent
              ? "Please enter the OTP sent to your email"
              : "Click the button to receive the OTP via email"}
          </label>
          {otpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p className="text-center text-blue-600 cursor-pointer underline mt-2" onClick={handleResendOtp}>
                Resend OTP
              </p>
            </>
          ) : (
            <button
              onClick={() => {otpSend(access_token)}}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Receive OTP
            </button>
          )}
        </div>
        {verificationStatus && (
          <div className="text-center">
            <button
              onClick={handleVerify}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify
            </button>
          </div>
        )}
        {verificationStatus && (
          <p className="mt-4 text-center text-red-600">{verificationStatus}</p>
        )}
      </div>
    </div>
  );
}

export default OtpVerification;
