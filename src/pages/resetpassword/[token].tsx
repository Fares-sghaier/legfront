import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../app/layoutsign';
import { useRouter } from 'next/router';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';


const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        await axios.post('https://legality-back-production.up.railway.app/users/checktokenexpiration', { token }); // Endpoint pour vérifier l'expiration du token
      } catch (error) {
        // Si le token est expiré, rediriger vers la page expired_reset_password
        router.push('http://localhost:3000/expired_reset_password');
      }
    };

    if (token) {
      checkTokenExpiration();
    }
  }, [token]);


  const validateForm = () => {

    // Validation for password
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      setError("Password must be at least 8 characters long and contain letters, numbers, and special characters");
      return false;
    }

    if (confirmPassword.length < 8 || !/[a-zA-Z]/.test(confirmPassword) || !/\d/.test(confirmPassword) || !/[^a-zA-Z0-9]/.test(confirmPassword)) {
      setError("Confirm password must be at least 8 characters long and contain letters, numbers, and special characters");
      return false;
    }

    // If all validations pass
    return true;
  };


  const handleResetPassword = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page

    if (!validateForm()) {
      return; // Stop submission if form is not valid
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('https://legality-back-production.up.railway.app/users/resetpassword', { token, password });
      setMessage(response.data.message);
      // Rediriger vers la page de connexion après réinitialisation réussie
      router.push('http://localhost:3000/signin');
    } catch (error) {
      setError('Expired token');
    }
  };

  return (
    <Layout>
      <section className="mt-8 px-2 sm:px-2 lg:px-4 mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="container mx-auto px-4 border border-gray-300 rounded-lg max-w-md">
          <div className="mx-auto py-10 p-6 bg-white rounded-lg">
            <h2 className="mt-6 mb-8 text-center text-3xl text-gray-900">
              Enter new password
            </h2>
            <form className="space-y-8 py-6" >
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
                  htmlFor="password"
                  className="block text-sm text-dark dark:text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="  Enter your new password"
                    value={password}
                    className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border  px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FiLock className="mr-2" />
                  </span>
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="mr-2" /> : <FiEye />}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-dark dark:text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="  Confirm password"
                    value={confirmPassword}
                    className={`border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border  px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none`}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <FiLock className="mr-2" />
                  </span>
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="mr-2" /> : <FiEye />}
                  </span>
                </div>
              </div>
              <button onClick={handleResetPassword} className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                Reset
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
