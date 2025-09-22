import React from "react";

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🎉 Thank You!
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Your inquiry has been successfully submitted.
          <br /> We’ll get back to you as soon as possible.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
