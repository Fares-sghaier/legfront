import React, { useState ,useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../app/layoutsign";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import Flags from "react-flags-select";
import Popup from '../components/Popup'; 
import sheet from '../components/sheet.module.css'
import Image from "next/image";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
const SignupPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [popupMessage, setPopupMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleSignInGoogle = () => {
    window.location.href = "https://legality-back-production.up.railway.app/auth/google"; // Redirect to Google sign-in
  };
  const { t } = useTranslation()
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result!== null && typeof reader.result === 'string') {
          setFormData({
           ...formData,
            avatar: reader.result
          });
          setAvatar(reader.result);
          validateField("avatar", reader.result); // Validate avatar field

        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    occupation_user: "", // Ajouter le champ occupation_user à l'état initial
    country_user:"",
    avatar:"",

  });
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    occupation_user: string;
    avatar:string;
    country_user:string;
  }

  const { firstName, lastName, email, password, occupation_user, country_user } = formData;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (formData.firstName.length < 1) {
      newErrors.firstName = t('common.requiredFirstName');
    }
    
    if (formData.lastName.length < 1) {
      newErrors.lastName = t('common.requiredLastName');
    }
    
    if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password) || !/[^a-zA-Z0-9]/.test(formData.password)) {
      newErrors.password = t('common.invalidPassword');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t('common.invalidEmail');
    }
    
    if (formData.firstName.length < 4) {
      newErrors.firstName = t('common.shortFirstName');
    }
    
    if (formData.lastName.length < 4) {
      newErrors.lastName = t('common.shortLastName');
    }
    
    if (!formData.avatar) {
      newErrors.avatar = t('common.requiredAvatar');
    }
    
    if (!formData.country_user) {
      newErrors.country_user = t('common.requiredCountry');
    }
    
    if (!formData.occupation_user) {
      newErrors.occupation_user = t('common.requiredOccupation');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const validateField = (name: string, value: string) => {
    const newErrors: Partial<FormData> = {};
    switch (name) {
      case 'firstName':
        if (value.length < 1) {
          newErrors.firstName = t('common.requiredFirstName');
        } else if (value.length < 4) {
          newErrors.firstName = t('common.shortFirstName');
        }
        break;
      case 'lastName':
        if (value.length < 1) {
          newErrors.lastName = t('common.requiredLastName');
        } else if (value.length < 4) {
          newErrors.lastName = t('common.shortLastName');
        }
        break;
      case 'password':
        if (value.length < 8 || !/[a-zA-Z]/.test(value) || !/\d/.test(value) || !/[^a-zA-Z0-9]/.test(value)) {
          newErrors.password = t('common.invalidPassword');
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = t('common.invalidEmail');
        }
        break;
      case 'avatar':
        if (!value) {
          newErrors.avatar = t('common.requiredAvatar');
        }
        break;
      case 'country_user':
        if (!value) {
          newErrors.country_user = t('common.requiredCountry');
        }
        break;
      case 'occupation_user':
        if (!value) {
          newErrors.occupation_user = t('common.requiredOccupation');
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
  };
  const handleoccupation_userChange = (event) => {
    setFormData({
      ...formData,
      occupation_user: event.target.value,
    });
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
  
    const user = {
      firstName_user: firstName,
      lastName_user: lastName,
      email_user: email,
      occupation_user: occupation_user,
      password_user: password,
      avatar: avatar,
      country_user: country_user,
    };
  
    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/users/signup", user);
      const data = response.data;
  
      if (data.success) {
        setMessage("Your account has been successfully created. Please check your email to activate your account!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          occupation_user: "",
          country_user: "",
          avatar:"",
        });  
        setTimeout(() => {
          window.location.href = "/signin";
        }, 3000); 
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  

  return (
    <Layout>
       <header
     
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
        className="mx-auto mt-8 px-2 sm:px-2 lg:px-4"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <div className="container mx-auto max-w-md rounded-lg border border-gray-300 px-4">
          <div className="mx-auto rounded-lg bg-white p-6 py-10">
            <h2 className="mb-8 mt-6 text-center text-3xl text-gray-900">
            {mounted ? t('common.free') : 'Loading...'}    
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

            <div className="mb-8 flex items-center justify-center">
              <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
              <p className="w-full px-5 text-center text-base font-medium text-body-color">
              {mounted ? t('common.registerEmail') : 'Loading...'}    
              </p>
              <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
            </div>

            <form onSubmit={handleSubmit}>
            {message || error ? (
  <div className="mb-4 flex items-center justify-center">
    <svg
      className={`mr-2 h-6 w-6 ${message ? "text-green-500" : "text-red-500"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {message ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01"
        />
      )}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
    <p className={`${message ? "text-green-500" : "text-red-500"} text-sm font-medium`}>
      {message || error}
    </p>
  </div>
) : null}
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm text-dark dark:text-white"
                    >
{mounted ? t('common.firstName') : 'Loading...'}                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        placeholder={i18n.language==='fr'? 'Entrer votre prénom' : 'Enter your first name'}
                        value={firstName}
                        className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                          errors.firstName ? sheet['error-border'] : formData.firstName ? sheet['valid-border'] : ''
                        }`}                    
                            onChange={handleInputChange}
                      />
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <FiUser className="mr-2" />
                      </span>
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm text-dark dark:text-white"
                    >
{mounted ? t('common.lastName') : 'Loading...'}    
            </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        placeholder={i18n.language==='fr'? 'Entrer votre nom' : 'Enter your last name'}
                        value={lastName}
                        className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                          errors.lastName ? sheet['error-border'] : formData.lastName ? sheet['valid-border'] : ''
                        }`}               
                                    onChange={handleInputChange}
                      />
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <FiUser className="mr-2" />
                      </span>
                    </div>
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-dark dark:text-white"
                  >
                    {mounted ? t('common.email') : 'Loading...'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="email"
                      placeholder={i18n.language==='fr'? 'Entrer votre e-mail' : 'Enter your email'} 
                      value={email}
                      className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                        errors.email ? sheet['error-border'] : formData.email ? sheet['valid-border'] : ''
                      }`}                       
                        onChange={handleInputChange}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <FiMail className="mr-2" />
                    </span>
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-dark dark:text-white"
                  >
                    {mounted ? t('common.password') : 'Loading...'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={i18n.language==='fr'? 'Entrer votre mot de passe' : 'Enter your password'} 
                      value={password}
                      className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                        errors.password ? sheet['error-border'] : formData.password ? sheet['valid-border'] : ''
                      }`}                    
                           onChange={handleInputChange}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <FiLock className="mr-2" />
                    </span>
                    <span
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEye className="mr-2" /> : <FiEyeOff />}
                    </span>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div>
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700 "                  >
                    Avatar
                  </label>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover bg blue"
                        />
                      ) : (
                        <BsPersonFill className="h-full w-full" />
                      )}
                    </span>

                    <label
                      htmlFor="file-input"
                      className={`ml-5 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${
                        errors.avatar ? sheet['error-border'] : formData.avatar ? sheet['valid-border'] : ''
                      }`}                      >
                      <span>{mounted ? t('common.uploadImages') : 'Loading...'}</span>
                      <input
                        type="file"
                        name="avatar"
                        id="file-input"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
                </div>
                <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block font-medium text-gray-600"
                    >
                      {mounted ? t('common.selectCountry') : 'Loading...'}
                    </label>
                    <Flags
            selected={formData.country_user}
            onSelect={(countryCode: string) => {
              setFormData((prevData) => ({
                ...prevData,
                country_user: countryCode,
              }));
              validateField("country_user", countryCode); // Validate country field
            }}
            searchable={true}
            className={`ml-5 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${
              errors.country_user ? sheet['error-border'] : formData.country_user ? sheet['valid-border'] : ''
            }`}  
            placeholder={i18n.language === 'fr' && mounted ? 'Sélectionnez un pays' : 'Select a country'}

          />
                  </div>
                  {errors.country_user && <p className="text-red-500 text-sm">{errors.country_user}</p>}

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm text-dark dark:text-white">
                    {mounted ? t('common.chooseOccupation') : 'Loading...'}
                    </label>
                    <br/>
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        id="lawyer"
                        name="occupation_user"
                        value="Lawyer"
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor="lawyer" className="text-sm text-dark dark:text-white">{mounted ? t('common.lawyer') : 'Loading...'}</label>
                      <input
                        type="radio"
                        id="accountant"
                        name="occupation_user"
                        value="Accountant"
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor="accountant" className="text-sm text-dark dark:text-white">{mounted ? t('common.accountant') : 'Loading...'}</label>
                      <input
                        type="radio"
                        id="other"
                        name="occupation_user"
                        value="Other"
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                    </div>

                  </div>
                  {errors.occupation_user && <p className="text-red-500 text-sm">{errors.occupation_user}</p>}

                  <div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90"
                    >
{mounted ? t('common.signUp') : 'Loading...'}                    </button>
                  </div>
                </div>
              </div>
            </form>
            <br />
            <p className="text-center text-base font-medium text-body-color">
            {mounted ? t('common.alreadyLegal') : 'Loading...'}    {" "}
              <Link href="/signin" className="text-primary hover:underline">
              {mounted ? t('common.signIn') : 'Loading...'}              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignupPage;