import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Terms and Conditions
        </h1>
        <div className="text-base text-justify">
          {" "}
          {/* Updated class here */}
          <p className="mb-6">
            <span className="font-bold inline-block mb-2">1. Introduction</span>{" "}
            <br />- These terms and conditions govern the use of the Airport
            Security System. By using the system, you agree to follow by these
            terms and conditions.
          </p>
          <p className="mb-6">
            <span className="font-bold inline-block mb-2">
              2. Purpose of the System
            </span>{" "}
            <br />- The System is designed to enhance security measures at
            airports by implementing facial recognition technology for staff
            access control and passport scanning for passenger flight schedule
            checking (Entry Time). The System aims to streamline security
            procedures and improve efficiency in airport operations.
          </p>
          <p className="mb-6">
            <span className="font-bold inline-block mb-2">
              3. Admin Responsibilities
            </span>{" "}
            <br />- Admin must adhere to all applicable laws and regulations
            governing airport security. Admin are responsible for ensuring the
            accuracy and integrity of the data provided to the System. Admin
            must not misuse the System for unauthorized purposes or access.
          </p>
          <p className="mb-6">
            <span className="font-bold inline-block mb-2">
              4. Privacy and Data Security
            </span>{" "}
            <br />- The System collects and processes personal data, including
            facial images and passport information, for security purposes only.
            All personal data collected by the System will be handled in
            accordance with applicable data protection laws and regulations.
            Admin must ensure the confidentiality and security of all data
            accessed through the System.
          </p>
          <p className="text-right font-bold text-gray-600">
            Thanks for reading!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
