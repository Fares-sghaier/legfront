import Link from "next/link";
import React, { useState } from 'react';
import { Metadata } from "next";
import Layout from '../app/layoutsign';
import axios from 'axios';
import { FiMail } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Sign In Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign In Page for Startup Nextjs Template",
  // other metadata
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    // Validation for firstName, lastName, city, speciality, phoneNumber
    // You can add your own validation conditions here
    if (email.length < 1) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // If all validations pass
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if form is not valid
    }
    try {
      await axios.post('https://legality-back-production.up.railway.app/users/forgotpassword', { email });
      setMessage('Password reset email sent successfully. Please check your email!');
    } catch (error) {
      if (error.response && error.response.status === 402) {
        setError("Account not activated.");
      } else
      setError('Failed to send password reset email. User not found.');
    }
  };

  return (
    <Layout>
      <section className="mt-8 px-2 sm:px-2 lg:px-4 mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="container mx-auto px-4 border border-gray-300 rounded-lg max-w-md">
          <div className="mx-auto py-10 p-6 bg-white rounded-lg">
            <h2 className="mt-6 mb-8 text-center text-3xl text-gray-900">
              Send email to your account
            </h2>
            <form className="space-y-8 py-6" onSubmit={handleSubmit}>
                  {message || error ? (
                    <div className="flex items-center justify-center mb-4">
                      <svg
                        className={`w-6 h-6 mr-2 ${message ? 'text-green-500' : 'text-red-500'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {message ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                        )}
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                      <p className={`${message ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                        {message || error}
                      </p>
                    </div>
                  ) : null}
                  <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-dark dark:text-white"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="email"
                    placeholder="  Enter your email"
                    value={email}
                    className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none }`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FiMail className="mr-2" />
                  </span>
                </div>
                </div>
                  <button className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                    Send
                  </button>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Don’t you have an account?{' '}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
