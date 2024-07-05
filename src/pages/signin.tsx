import Link from "next/link";
import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { Metadata } from "next";
import Layout from "../app/layoutsign";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
export const metadata: Metadata = {
  title: "Sign In Page | LegalNet",
  description: "This is Home for LegalNet",
};

const SigninPage = () => {
  const router = useRouter();
  const [email_user, setEmail_user] = useState("");
  const [password_user, setPassword_user] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const validateForm = () => {
    if (email_user.length < 1 && password_user.length > 1) {
      setError(t('common.emailError'));
      return false;
    }
   
    if (email_user.length > 1 && password_user.length < 1) {
      setError(t('common.passwordError'));
      return false;
    }
    if (email_user.length < 1 && password_user.length < 1) {
      setError(t('common.requireError'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_user)) {
      setError(t('common.validEmailError'));
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/users/login", {
        email_user,
        password_user,
      });
      // Stocker le token JWT dans le cookie
      document.cookie = `jwt=${response.data.token}; path=/`;
      router.push("/user");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(
          "User does not exist. Please create an account or login with Google.",
        );
      } else if (error.response && error.response.status === 402) {
        setError(
          "Your account is not activated. Please check your email to activate your account!",
        );
      } else if (error.response && error.response.status === 403) {
        setError("Invalid password.");
      }
    }
  };

  const handleSignInGoogle = () => {
    window.location.href = "https://legality-back-production.up.railway.app/auth/google"; // Redirect to Google sign-in
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  return (
    <Layout>
      <header
        className={`header left-0 top-4 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <Link
              href="/"
             className="absolute top--3 left--10 pt-20 pr-20"
            >
             <Image
                src="/images/logo/semicircle.webp"
                alt="logo"
              width={60}
              height={50}
              className="dark:hidden"
            />
            <Image
                src="/images/logo/semicircle.webp"
                alt="logo"
              width={80}
              height={50}
              className="hidden dark:block"
            />
          
            </Link>
          </div>
        </div>
      </header>

      <section
        className="mx-auto mt-16"
        style={{ fontFamily: "Georgia, serif", minHeight: "100vh" }}
      >
        <div className="container mx-auto max-w-md rounded-lg border border-gray-300 px-4">
          <div className="mx-auto rounded-lg bg-white p-4 py-6">
            <h2 className="mb-8 mt-6 text-center text-3xl text-gray-900">
            {mounted ? t('common.loginAccount') : 'Loading...'}
            </h2>
            <button
              onClick={handleSignInGoogle}
              className="border-stroke mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
            >
              <span className="mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_95:967)">
                    <path
                      d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_95:967">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {mounted ? t('common.signInGoogle') : 'Loading...'}
            </button>
            {/* Formulaire de connexion */}
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="mb-4 flex items-center justify-center">
                  <svg
                    className="mr-2 h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  <p className="text-sm font-medium text-red-500">{error}</p>
                </div>
              )}

              {/* Champs d'email_user */}
              <div>
                <label
                  htmlFor="email_user"
                  className="block text-sm text-dark dark:text-white"
                >
                  {mounted ? t('common.email') : 'Loading...'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="email_user"
                    placeholder= {i18n.language==='fr'? 'Entrer votre e-mail' : 'Enter your email'} 
                    value={email_user}
                    className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                      error && "border-red-500" // Ajout de la classe border-red-500 si une erreur est présente
                    }`}
                    onChange={(e) => setEmail_user(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FiMail className="mr-2" />
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password_user"
                  className="block text-sm text-dark dark:text-white"
                >
                                    {mounted ? t('common.password') : 'Loading...'}

                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password_user"
                    placeholder= {i18n.language==='fr'? 'Entrer votre mot de passe' : 'Enter your password'} 
                    value={password_user}
                    className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                      error && "border-red-500" // Ajout de la classe border-red-500 si une erreur est présente
                    }`}               
                         onChange={(e) => setPassword_user(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FiLock className="mr-2" />
                  </span>
                  <span
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="mr-2" /> : <FiEye />}
                  </span>
                </div>
              </div>

              <div className="mb-4 sm:mb-0">
                <label
                  htmlFor="checkboxLabel"
                  className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="checkboxLabel"
                      className="sr-only"
                    />
                    <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                      <span className="opacity-0">
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#3056D3"
                            stroke="#3056D3"
                            strokeWidth="0.4"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  {mounted ? t('common.keepSignIn') : 'Loading...'}
                  </label>
              </div>

              {/* Bouton de connexion */}
              <div className="mb-6">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                >
                 {mounted ? t('common.signIn') : 'Loading...'}
                </button>
              </div>
            </form>
            {/* Forgot password_user link */}
            <p className="mb-6 text-center text-base font-medium text-body-color">
              <Link
                href="/forgot"
                className="cursor-pointer text-primary hover:underline"
              >
                {mounted ? t('common.forgotPassword') : 'Loading...'}
              </Link>
            </p>
            {/* Sign up link */}
            <p className="text-center text-base font-medium text-body-color">
            {mounted ? t('common.noAccount') : 'Loading...'}{" "}
              <Link href="/signup" className="text-primary hover:underline">
              {mounted ? t('common.signUp') : 'Loading...'}
              </Link>
            </p>
          </div>
        </div>

        {/* SVG background */}
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </Layout>
  );
};

export default SigninPage;
