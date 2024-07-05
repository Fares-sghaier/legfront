import { useEffect, useState } from 'react';
import axios from 'axios';

import { useRouter } from 'next/router';
import { FiUser, FiLogOut, FiSettings,FiLock ,FiMail,FiPhone,FiMapPin, FiEyeOff, FiEye, FiGlobe} from 'react-icons/fi'; // Importation des icônes
import Link from 'next/link';
import {Modal,Button, Select} from 'antd';
import sheet from '../components/sheet.module.css'
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n";
const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState({ id_user : 0,firstName_user: '', lastName_user: '', email_user: '', avatar_url: '',occupation_user:'',country_user: '',
    phoneNumber_user:'',password_user:''});
  const [showMenu, setShowMenu] = useState(false); // État pour afficher/cacher le menu
    const { t,i18n } =useTranslation();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://legality-back-production.up.railway.app/users/profile', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        router.push('/signin');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('https://legality-back-production.up.railway.app/users/logout', {}, { withCredentials: true });
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNameClick = () => {
    setShowMenu(!showMenu); // Inverser l'état du menu
    showModal();
  };
  const [open, setOpen] = useState(false);
  const [open1,setOpen1] = useState(false);
  const [open2,setOpen2] = useState(false);
  const [open3,setOpen3] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  interface FormData {
    id_user: number;
    firstName_user: string;
    lastName_user: string;
    dateOfBirth_user: string; // Assumed to be a string for simplicity, consider using Date or Moment.js if handling dates extensively
    gender_user: string;
    phoneNumber_user: string;
    country_user: string;
    city_user: string;
    postalCode_user: string;
    email_user: string;
    avatar_url: string;
    password_user:string;
  }
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value)
  };
  const [formData, setFormData] = useState({
    id_user: 0,
    firstName_user: '',
    lastName_user: '',
    dateOfBirth_user: '',
    gender_user: '',
    phoneNumber_user: '',
    country_user: '',
    city_user: '',
    postalCode_user: '',
    email_user: '',
    avatar_url: '',
    password_user:'',
  });
  const [user1, setUser1] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass,setMessageClass] =useState('text-red-500');
  const handleOpenModal = () => {
   setOpen3(true)
  };
  const handleChangePassword = async (e ) => {
    e.preventDefault();
    if (!validateForm()) {
      
      return;
    }
    try {
      const response = await axios.put(`https://legality-back-production.up.railway.app/users/changePassword/${user.id_user}`, {
        oldPassword,
        newPassword,
      });
      if (response.data.success) {
        setMessage('Password changed successfully.');
        setMessageClass('text-green-500'); 
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => {
          setOpen1(false); 
          setMessageClass('text-red-500'); 
          setActiveSection('general');
          setMessage('');
          router.push('/user'); 
        }, 1000);      } else {
        setMessage(response.data.message);
     

      }
    } catch (error) {
      setMessage(t('common.incorrectPassword'));
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://legality-back-production.up.railway.app/users/profile', { withCredentials: true });
        setUser1(response.data.user);
        // Pré-remplir les champs du formulaire avec les données de l'utilisateur
        setFormData({
          id_user: response.data.user.id_user,
          firstName_user: response.data.user.firstName_user,
          lastName_user: response.data.user.lastName_user,
          dateOfBirth_user: response.data.user.dateOfBirth_user,
          gender_user: response.data.user.gender_user,
          phoneNumber_user: response.data.user.phoneNumber_user,
          country_user: response.data.user.country_user,
          city_user: response.data.user.city_user,
          postalCode_user: response.data.user.postalCode_user,
          email_user: response.data.user.email_user,
          avatar_url: response.data.user.avatar_url,
          password_user:response.data.user.password_user,
        });
        // Mettre à jour l'aperçu de l'image avec l'avatar_url
        setPreviewImage(response.data.user.avatar_url);
        
      } catch (error) {
        router.push('/signin');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateField(name, value);

  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Ensure reader result is a string before updating state
        if (typeof reader.result === 'string') {
          setFormData({
            ...formData,
            avatar_url: reader.result 
          });
           setPreviewImage(reader.result);

          // Perform validation if needed
           validateField("avatar", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [showOldPassword, setShowOldPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    const selectedDate = new Date(formData.dateOfBirth_user);
    const today = new Date();
    if (formData.firstName_user.length < 1) {
      newErrors.firstName_user = t('common.requiredFirstName');
    }
    
    if (formData.lastName_user.length < 1) {
      newErrors.lastName_user = t('common.requiredLastName');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_user)) {
      newErrors.email_user = t('common.invalidEmail');
    }
    
    if (formData.firstName_user.length < 4) {
      newErrors.firstName_user = t('common.shortFirstName');
    }
    
    if (formData.lastName_user.length < 4) {
      newErrors.lastName_user = t('common.shortLastName');
    }
    
    if (!formData.avatar_url) {
      newErrors.avatar_url = t('common.requiredAvatar');
    }
    
    if (selectedDate > today) {
      newErrors.dateOfBirth_user = t('common.futureDateOfBirthUser');
    }
    
    if (!formData.gender_user) {
      newErrors.gender_user = t('common.requiredGenderUser');
    }
    
    if (!formData.country_user || formData.country_user.length < 1) {
      newErrors.country_user = t('common.requiredCountry');
    }
    
    if (!formData.city_user || formData.city_user.length < 1) {
      newErrors.city_user = t('common.requiredCityUser');
    }
    
    if (!formData.postalCode_user || formData.postalCode_user.length < 1) {
      newErrors.postalCode_user = t('common.requiredPostalCodeUser');
    }
    
    if (!formData.phoneNumber_user || formData.phoneNumber_user.length !== 8) {
      newErrors.phoneNumber_user = t('common.invalidPhoneNumberUser');
    }
    
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^a-zA-Z0-9]/.test(newPassword)) {
      newErrors.password_user = t('common.invalidPassword');
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const validateField = (name: string, value: string) => {
    const newErrors: Partial<FormData> = {};
    switch (name) {
      case 'firstName_user':
        if (value.length < 1) {
          newErrors.firstName_user = t('common.requiredFirstName');
        } else if (value.length < 4) {
          newErrors.firstName_user = t('common.shortFirstName');
        }
        break;
      case 'lastName_user':
        if (value.length < 1) {
          newErrors.lastName_user = t('common.requiredLastName');
        } else if (value.length < 4) {
          newErrors.lastName_user = t('common.shortLastName');
        }
        break;
      case 'phoneNumber_user':
        if (value.length !== 8) {
          newErrors.phoneNumber_user = t('common.invalidPhoneNumberUser');
        }
        break;
      case 'avatar_url':
        if (!value) {
          newErrors.avatar_url = t('common.requiredAvatar');
        }
        break;
      case 'email_user':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email_user = t('common.invalidEmail');
        }
        break;
      case 'country_user':
        if (value.length < 1) {
          newErrors.country_user = t('common.requiredCountry');
        }
        break;
      case 'postalCode_user':
        if (value.length < 1) {
          newErrors.postalCode_user = t('common.requiredPostalCodeUser');
        }
        break;
      case 'city_user':
        if (value.length < 1) {
          newErrors.city_user = t('common.requiredCityUser');
        }
        break;
      case 'password_user':
        if (value.length < 8 || !/[a-zA-Z]/.test(value) || !/\d/.test(value) || !/[^a-zA-Z0-9]/.test(value)) {
          newErrors.password_user = t('common.invalidPassword');
        }
        break;
      case 'dateOfBirth_user':
        const selectedDate = new Date(value);
        const today = new Date();
    
        if (selectedDate > today) {
          newErrors.dateOfBirth_user = t('common.futureDateOfBirthUser');
        }
        break;
      case 'gender_user':
        if (!value) {
          newErrors.gender_user = t('common.requiredGenderUser');
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (!user) {
        throw new Error('User not found');
      }
      const response = await fetch(`http://127.0.0.1:5000/users/${user.id_user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      e.target.reset();
      // Réinitialiser l'aperçu de l'image
      setPreviewImage('');
      window.location.href="/user";
    } catch (error) {
      console.error('Error updating user:', error.message);
      setErrorMessage('Failed to update user. Please try again later.');
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="rounded-full w-24 h-24 mb-4" />
            ) : (
              <div className="rounded-full bg-gray-300 w-24 h-24 flex items-center justify-center text-4xl mb-4">
                {user.firstName_user.charAt(0)}
              </div>
            )}
            <p className="font-bold text-xl mb-1 text-gray-800">
              {user.firstName_user} {user.lastName_user}
            </p>
            <div className="flex items-center text-lg text-gray-600">
              <FiMail className="mr-2" />
              {user.email_user}
            </div>
            <div className="flex items-center text-lg text-gray-600">
              <FiMapPin className="mr-2" />
              {user.country_user}
            </div>
            <div className="flex items-center text-lg text-gray-600">
              <FiPhone className="mr-2" />
              {user.phoneNumber_user}
            </div>
            <div className="flex items-center text-lg text-gray-600">
  {user.occupation_user === 'Lawyer' && (
    <img src="/lawyer.png" alt="Lawyer" className="w-6 h-6 mr-2" />
  )}
  {user.occupation_user === 'Accountant' && (
    <img src="/accountant.png" alt="Accountant" className="w-6 h-6 mr-2" />
  )}
  <span className="mr-2">{user.occupation_user}</span>
</div>
          </div>
        );
      case 'profile':
        return <div>
         <div className="">
      <form onSubmit={handleSubmit} className="bg-white  rounded-lg">
      <h2 className="text-[16px] text-[#1C6AE4] font-poppins font-bold whitespace-nowrap ">
      {t('common.updateProfile')}     </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700"> {t('common.firstName')} </label>
            <input
              type="text"
              id="firstName"
              name="firstName_user"
              value={formData.firstName_user}
              onChange={handleChange}
              placeholder="First Name"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.firstName_user ? 'border-red-500' : formData.firstName_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName_user && <p className="text-red-500 text-sm">{errors.firstName_user}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700"> {t('common.lastName')} </label>
            <input
              type="text"
              id="lastName"
              name="lastName_user"
              value={formData.lastName_user}
              onChange={handleChange}
              placeholder="Last Name"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.lastName_user ? 'border-red-500' : formData.lastName_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName_user && <p className="text-red-500 text-sm">{errors.lastName_user}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700"> {t('common.dateBirth')} </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth_user"
              value={formData.dateOfBirth_user}
              onChange={handleChange}
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.dateOfBirth_user ? 'border-red-500' : formData.dateOfBirth_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth_user && <p className="text-red-500 text-sm">{errors.dateOfBirth_user}</p>}
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700"> {t('common.gender')} </label>
            <select
              id="gender"
              name="gender_user"
              value={formData.gender_user}
              onChange={handleChange}
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.gender_user ? 'border-red-500' : formData.gender_user ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <option value="">{t('common.selectGender')}</option>
              <option value="m">{t('common.male')}</option>
              <option value="f">{t('common.female')}</option>
            </select>
            {errors.gender_user && <p className="text-red-500 text-sm">{errors.gender_user}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">{t('common.phone')}</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber_user"
              value={formData.phoneNumber_user}
              onChange={handleChange}
              placeholder="Phone Number"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.phoneNumber_user ? 'border-red-500' : formData.phoneNumber_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber_user && <p className="text-red-500 text-sm">{errors.phoneNumber_user}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">{t('common.country')}</label>
            <input
              type="text"
              id="country"
              name="country_user"
              value={formData.country_user}
              onChange={handleChange}
              placeholder="Country"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.country_user ? 'border-red-500' : formData.country_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.country_user && <p className="text-red-500 text-sm">{errors.country_user}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('common.city')}</label>
            <input
              type="text"
              id="city"
              name="city_user"
              value={formData.city_user}
              onChange={handleChange}
              placeholder="City"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.city_user ? 'border-red-500' : formData.city_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.city_user && <p className="text-red-500 text-sm">{errors.city_user}</p>}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">{t('common.postalCode')}</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode_user"
              value={formData.postalCode_user}
              onChange={handleChange}
              placeholder="Postal Code"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.postalCode_user ? 'border-red-500' : formData.postalCode_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.postalCode_user && <p className="text-red-500 text-sm">{errors.postalCode_user}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('common.email')}</label>
            <input
              type="email"
              id="email"
              name="email_user"
              value={formData.email_user}
              onChange={handleChange}
              placeholder="Email"
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.email_user ? 'border-red-500' : formData.email_user ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.email_user && <p className="text-red-500 text-sm">{errors.email_user}</p>}
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
            {previewImage && <img src={previewImage} alt="Avatar Preview" className="rounded-full mb-2" style={{ maxWidth: '50px', height: '50px' }} />}
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              className={`border w-full rounded-lg px-4 py-2 text-base text-black outline-none transition-all duration-300 focus:border-primary ${
                errors.avatar_url ? 'border-red-500' : formData.avatar_url ? 'border-green-500' : 'border-gray-300'
              }`}
            />
            {errors.avatar_url && <p className="text-red-500 text-sm">{errors.avatar_url}</p>}
          </div>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
        >
          {t('common.update')}
        </button>
      </form>
    </div>
        </div>

        ;
      case 'change-password':
        return (
         <div>
      <div className="">
  <h2 className="text-[16px] text-[#1C6AE4] font-poppins font-bold whitespace-nowrap ">
  {t('common.changePassword')}
  </h2>
  <form onSubmit={handleChangePassword} className="max-w-sm ">
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{t('common.oldPassword')}</label>
      <div className="relative">
        <input
          type={showOldPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            {showOldPassword ? (
              <FiEyeOff className="mr-2" />
            ) : (
              <FiEye />
            )}
          </button>
        </span>
      </div>

    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{t('common.newPassword')}</label>
      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            {showNewPassword ? (
              <FiEyeOff className="mr-2" />
            ) : (
              <FiEye />
            )}
          </button>
        </span>
      </div>
      {errors.password_user && <p className="text-red-500 text-sm">{errors.password_user}</p>}

    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
    >
      {t('common.changePassword')}
    </button>
  {message && <p className={`mt-4 ${messageClass}`}>{message}</p>}
  </form>
          </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const showModal1 = () => {
    setOpen1(true);
    setOpen(false);
  };
  const showModal2 = () => {
    setOpen2(true);
    setOpen(false);
  };
  const handleCancel2 = () => {
    setOpen2(false);
    setActiveSection('general')
  };
  const handleCancel3 = () => {
    setOpen3(false);
  };
  const handleCancel1 = () => {
    setOpen1(false);
    setActiveSection('general')
    setMessage('');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="relative">
      {user && (
        <div>
          <div className="flex items-center mb-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${user.avatar_url ? "" : "bg-gray-300"}`} onClick={handleNameClick}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-600 text-lg">
                  {user.firstName_user.charAt(0)}
                </div>
              )}

            </div>
          </div>
          <Modal
  open={open}
  onCancel={handleCancel}
  footer={null} 
  className="p-2 rounded-lg fixed top-20 right-10 max-w-xs" 
>
  <div className="flex items-center mb-4 pt-3">
    {user.avatar_url ? (
      <img src={user.avatar_url} alt="avatar" className="w-12 h-12 rounded-full mr-4" /> // Reduced avatar size
    ) : (
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-600 text-lg mr-4"> {/* Reduced placeholder size */}
        {user.firstName_user.charAt(0)}
      </div>
    )}
    <div>
      <p className="font-bold text-lg text-gray-800"> {/* Adjusted font size */}
        {user.firstName_user} {user.lastName_user}
      </p>
      <p className="font-semibold text-sm text-gray-600"> {/* Adjusted font size */}
        {user.occupation_user}
      </p>
      <p className="font-semibold text-sm text-gray-600"> {/* Adjusted font size */}
        {user.email_user}
      </p>
    </div>
  </div>
  <hr className="my-2" /> {/* Reduced margin */}
  <div className="flex flex-col space-y-2"> {/* Reduced spacing */}
    <button onClick={showModal1} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300">
      <FiSettings className="mr-1" /> {/* Adjusted margin */}
      {t('common.accountSettings')}  
        </button>
    <button onClick={showModal2} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300">
      <FiGlobe className="mr-1" /> {/* Adjusted margin */}
      {t('common.language')}
    </button>
    <button onClick={handleOpenModal} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300">
      <FiLogOut className="mr-1" /> {/* Adjusted margin */}
      {t('common.logOut')}
    </button>
  </div>
</Modal>
<Modal
      open={open3}
      onCancel={handleCancel3}
      footer={[
        <Button key="back" onClick={handleCancel3}>
          {t('common.no')} 
        </Button>,
        <Button key="submit" type="primary" onClick={handleLogout}>
           {t('common.yes')}
        </Button>,
      ]}
    >
      <p> {t('common.confirmLogOut')}</p>
    </Modal>
<Modal
      open={open2}
      onCancel={handleCancel2}
      footer={null}
      width={500} 
      
    >
    <Select
        placeholder="Select Language"
        onChange={handleLanguageChange}

        style={{ width: '100%', marginTop:'20px'}}
      >
        <Select.Option value="en">English</Select.Option>
        <Select.Option value="fr">French</Select.Option>
      </Select>
      </Modal>
    <Modal
      open={open1}
      onCancel={handleCancel1}
      footer={null}
      width={1000} 
    >
      <div className="flex h-96 ">
        <div className="bg-gray-200 w-1/4 h-full overflow-auto">
          <ul className="space-y-2">
            <li className="flex items-center">
              <button
                className={`flex items-center w-full text-left py-2 px-4 rounded-lg ${activeSection === 'general' ? 'font-bold' : ''}`}
                onClick={() => setActiveSection('general')}
              >
                <FiSettings className="mr-2" />
                {t('common.general')}
              </button>
            </li>
            <li className="flex items-center">
              <button
                className={`flex items-center w-full text-left py-2 px-4 rounded-lg ${activeSection === 'profile' ? 'font-bold' : ''}`}
                onClick={() => setActiveSection('profile')}
              >
                <FiUser className="mr-2" />
                {t('common.profile')}
              </button>
            </li>
            <li className="flex items-center">
              <button
                className={`flex items-center w-full text-left py-2 px-4 rounded-lg ${activeSection === 'change-password' ? 'font-bold' : ''}`}
                onClick={() => setActiveSection('change-password')}
              >
                <FiLock className="mr-2" />
                {t('common.changePassword')} 
                             </button>
            </li>
          </ul>
        </div>

        {/* Section Content */}
        <div className="p-4 w-3/4 overflow-auto">
          {renderSectionContent()}
        </div>
      </div>
    </Modal>
        </div>
      )}
    </div>
  );
};

export default Profile;


