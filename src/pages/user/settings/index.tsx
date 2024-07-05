import Headeruser from '@/components/Headeruser';
import SideLeftBar from '@/components/SideLeftBar/sideLeftBar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Layoutuser from "../../../app/layoutuser";
import FriendsList from '../listamis';
import { TbArrowBarToDown, TbArrowBarToUp } from 'react-icons/tb';
import { set } from 'js-cookie';
import sheet from '../../../components/sheet.module.css'

const UpdateUserForm = () => {
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  interface FormData {
    id_user: string;
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
  }
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  const [formData, setFormData] = useState({
    id_user: '',
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
  });
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://legality-back-production.up.railway.app/users/profile', { withCredentials: true });
        setUser(response.data.user);
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
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    const selectedDate = new Date(formData.dateOfBirth_user);
    const today = new Date();
    if (formData.firstName_user.length < 1) {
      newErrors.firstName_user = "First name is required";
    }

    if (formData.lastName_user.length < 1) {
      newErrors.lastName_user = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_user)) {
      newErrors.email_user = "Please enter a valid email address";
    }

    if (formData.firstName_user.length < 4) {
      newErrors.firstName_user = "First name must be at least 4 characters long";
    }

    if (formData.lastName_user.length < 4) {
      newErrors.lastName_user = "Last name must be at least 4 characters long";
    }
    if (!formData.avatar_url) {
      newErrors.avatar_url = "Please upload an avatar";
    }
    
   
    if ( selectedDate > today ) {
      newErrors.dateOfBirth_user = "Date of birth cannot be in the future";
    }
    if(!formData.gender_user){
      newErrors.gender_user = "Please select a gender";

    }
    if (!formData.country_user || formData.country_user.length < 1) {
      newErrors.country_user = "Please enter a country";
    }
    if (!formData.city_user || formData.city_user.length < 1) {
      newErrors.city_user = "Please enter a city";
    }
    if (!formData.postalCode_user || formData.postalCode_user.length < 1) {
      newErrors.postalCode_user = "Please enter a postal code";
    }
    if( !formData.phoneNumber_user || formData.phoneNumber_user.length != 8){
      newErrors.phoneNumber_user = "Phone number must have 8 numbers";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const validateField = (name: string, value: string) => {
    const newErrors: Partial<FormData> = {};
    switch (name) {
      case 'firstName_user':
        if (value.length < 1) {
          newErrors.firstName_user = "First name is required";
        } else if (value.length < 4) {
          newErrors.firstName_user = "First name must be at least 4 characters long";
        }
        break;
      case 'lastName_user':
        if (value.length < 1) {
          newErrors.lastName_user = "Last name is required";
        } else if (value.length < 4) {
          newErrors.lastName_user = "Last name must be at least 4 characters long";
        }
        break;
        case 'phoneNumber_user':
          if (value.length != 8) {
            newErrors.phoneNumber_user = "Phone number must have 8 numbers";
          }         
           break;
      case 'avatar_url':
        if (!value) {
          newErrors.avatar_url = "Please upload an avatar";
        }
        break;
        case 'email_user':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.email_user = "Please enter a valid email address";
          }
          break;
        case 'country_user':
          if (value.length < 1) {
            newErrors.country_user = "Please enter a country";
          }
          break;
          case 'postalCode_user':
            if (value.length < 1) {
              newErrors.postalCode_user = "Please enter a postal code ";
            }
            break;
          case 'city_user':
            if (value.length < 1) {
              newErrors.city_user = "Please enter a city";
            }
            break;
        case 'dateOfBirth_user':
          const selectedDate = new Date(value);
          const today = new Date();
    
          if (selectedDate > today) {
            newErrors.dateOfBirth_user = "Date of birth cannot be in the future";
          } 
          break;
          case 'gender_user':
            if (!value) {
              newErrors.gender_user = "Please select a gender";
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

  return (
    <Layoutuser>
      <div className="flex font-serif bg-[#f8f8f8]">
        <Headeruser  user = {user} />
        <ToastContainer />
        <div className="mx-auto w-1/2 p-4">
          <SideLeftBar />
          <br />
          <br />
          <br />
          <br />

          <div className="max-w-8xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl mb-4">Update Your Profile</h2>
              <br></br>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" id="firstName" name="firstName_user" value={formData.firstName_user} onChange={handleChange} placeholder="First Name"  className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                          errors.firstName_user ? sheet['error-border'] : formData.firstName_user ? sheet['valid-border'] : ''
                        }`} />
              </div>
              {errors.firstName_user && <p className="text-red-500 text-sm">{errors.firstName_user}</p>}

              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="lastName" name="lastName_user" value={formData.lastName_user} onChange={handleChange} placeholder="Last Name"
                className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.lastName_user ? sheet['error-border'] : formData.lastName_user ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.lastName_user && <p className="text-red-500 text-sm">{errors.lastName_user}</p>}

              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth_user" value={formData.dateOfBirth_user} onChange={handleChange} 
                className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.dateOfBirth_user ? sheet['error-border'] : formData.dateOfBirth_user ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.dateOfBirth_user && <p className="text-red-500 text-sm">{errors.dateOfBirth_user}</p>}

              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select id="gender" name="gender_user" value={formData.gender_user} onChange={handleChange}
                 className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.gender_user ? sheet['error-border'] : formData.gender_user ? sheet['valid-border'] : ''
                }`}>
                  <option value="">Select Gender</option>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>
              {errors.gender_user && <p className="text-red-500 text-sm">{errors.gender_user}</p>}

              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phoneNumber" name="phoneNumber_user" value={formData.phoneNumber_user} onChange={handleChange} placeholder="Phone Number" 
               className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                errors.phoneNumber_user ? sheet['error-border'] : formData.phoneNumber_user ? sheet['valid-border'] : ''
              }`} />
            </div>
            {errors.phoneNumber_user && <p className="text-red-500 text-sm">{errors.phoneNumber_user}</p>}
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" id="country" name="country_user" value={formData.country_user} onChange={handleChange} placeholder="Country" 
                 className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.country_user ? sheet['error-border'] : formData.country_user ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.country_user && <p className="text-red-500 text-sm">{errors.country_user}</p>}
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" name="city_user" value={formData.city_user} onChange={handleChange} placeholder="City"
                 className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.city_user ? sheet['error-border'] : formData.city_user ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.city_user && <p className="text-red-500 text-sm">{errors.city_user}</p>}
              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode_user" value={formData.postalCode_user} onChange={handleChange} placeholder="Postal Code"
                 className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.postalCode_user ? sheet['error-border'] : formData.postalCode_user ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.postalCode_user && <p className="text-red-500 text-sm">{errors.postalCode_user}</p>}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email_user" value={formData.email_user}  onChange={handleChange} placeholder="Email" 
               className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                errors.email_user ? sheet['error-border'] : formData.email_user ? sheet['valid-border'] : ''
              }`} />
            </div>
            {errors.email_user && <p className="text-red-500 text-sm">{errors.email_user}</p>}
               <div className="mb-4">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                {previewImage && <img src={previewImage} alt="Avatar Preview" style={{ borderRadius: '50%', maxWidth: '50px', height: '50px' }} />}
                <br></br>
                <input
                
                type="file" id="avatar" name="avatar"  onChange={handleFileChange}
                 className={`border-stroke w-full rounded-sm border px-6 py-3 text-base text-black outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none ${
                  errors.avatar_url ? sheet['error-border'] : formData.avatar_url ? sheet['valid-border'] : ''
                }`} />
              </div>
              {errors.avatar_url && <p className="text-red-500 text-sm">{errors.avatar_url}</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <button
                type="submit"
                style={{
                  backgroundColor: '#357ae8',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <br />
      <div className="fixed bottom-0 right-8 h-20 w-50 text-black">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded" style={{ width: '250px' }} onClick={toggleContent}>
          <div className="flex items-center">
            <span>Messageries</span>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            {isContentVisible ? (
              <TbArrowBarToDown className="ml-2" />
            ) : (
              <TbArrowBarToUp className="ml-2" />
            )}
          </div>
        </button>
        {isContentVisible && (
          <>
            <div className="mx-auto w-full sm:w-64">
              <div className="mx-auto mt-20 w-full sm:mt-64 sm:w-52">
                <FriendsList />
              </div>
            </div>
          </>
        )}
      </div>
    </Layoutuser >
  );
};

export default UpdateUserForm;
