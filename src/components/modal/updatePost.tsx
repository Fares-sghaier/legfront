import React, { FormEvent, useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Flags from "react-flags-select";
import sheet from '../sheet.module.css';
import {Switch} from 'antd';
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
interface User {
  firstname: string;
  lastname: string;
  id_user?: number;
  avatar_url:string;
}
interface Project {
  id_project : number;
  name_project: string;
  description_project: string;
  user_id_user?: number;
  images: string[];
  country: string | undefined;
  legalField: string | undefined;
  anonym: boolean;
}

const PostForm = ({fetchProjects , project}) => {
  const [countries, setCountries] = useState([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { t } = useTranslation()

  const [formData, setFormData] = useState<FormData>({
    name_project: "",
    description_project: "",
    user_id_user: 0,
    images: [],
    country: "",
    legalField: "",
    anonym: false,
  });
  interface FormData {
    name_project: string;
    description_project: string;
    user_id_user: number;
    country: string;
    legalField:string;
    anonym:boolean;
    images: string[];
  }
  const [user, setUser] = useState<User>({});
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, anonym: checked });
  };
  useEffect(() => {
    if (project) {
      setFormData({
        name_project: project.name_project || "",
        description_project: project.description_project || "",
        user_id_user: project.user_id_user || 0,
        images: project.images || [],
        country: project.country || "",
        legalField: project.legalField || "",
        anonym: project.anonym || false,
      });
    }
  }, [project]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: User }>(
          "https://legality-back-production.up.railway.app/users/profile",
          { withCredentials: true },
        );
        setUser(response.data.user);
        setPreviewImages([response.data.user.avatar_url]); 
        setFormData((prevData) => ({
          ...prevData,
          user_id_user: response.data.user.id_user || 0,
          
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);
// Change cloudinary name in prod !
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dojkvpoir/upload";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const fileUrls = await Promise.all(
        fileArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "ml_default");

          const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json();
            return responseData.secure_url;
          } else {
            throw new Error("Failed to upload image to Cloudinary");
          }
        }),
      );

      setPreviewImages(fileUrls);
      setFormData((prevData) => ({
        ...prevData,
        images: fileUrls,
      }));

    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  
    validateField(name as keyof FormData, inputValue);
  };
  
  const validateField = (name: keyof FormData, value: string | number | boolean) => {
    const newErrors: Partial<FormData> = {};
  
    switch (name) {
      case 'name_project':
        if (value.length < 5) {
          newErrors.name_project = t('common.postTitleError');
        }
        break;
      case 'description_project':
        if (value.length < 10) {
          newErrors.description_project =  t('common.postDescriptionError');
        }

        break;
      case 'country':
        if (!value) {
          newErrors.country = t('common.countryError');
        }
        break;
      case 'legalField':
        if (!value) {
          newErrors.legalField = t('common.legalError');
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
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
  
    if (formData.name_project.length < 5) {
      newErrors.name_project = t('common.postTitleError');
    }
  
    if (formData.description_project.length < 10) {
      newErrors.description_project = t('common.postDescriptionError');
    }
  
    if (!formData.country) {
      newErrors.country = t('common.countryError');
    }
  
    if (!formData.legalField) {
      newErrors.legalField =t('common.countryError');
    }

  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.put(`https://legality-back-production.up.railway.app/projects/${project.id_project}`, formData);
      setMessage("Post updated successfully.");
      setError("");
      fetchProjects();
      setIsPopupVisible(true);
      
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Error updating project. Please try again.");
      setMessage("");
    }
  };
  const handleCloseModal = () => {
    // Add your logic to close the modal here
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div >
      <div >
      <h2 className="text-[16px] text-[#1C6AE4] font-poppins font-bold whitespace-nowrap my-3">  {t('common.updatePost')} </h2>
        <button className="modal-close" onClick={handleCloseModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-body  flex">
          <div className="w-1/2 pr-4 ">
            <div className="mb-4">
              <label htmlFor="name_project" className=" block text-sm font-medium text-gray-700">
              {t('common.title')}       
                     </label>
              <input
                type="text"
                id="name_project"
                name="name_project"
                value={formData.name_project}
                onChange={handleInputChange}
                className={`w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2  focus:border-primary ${
                  errors.name_project ? sheet['error-border'] : formData.name_project.trim() !== '' ? sheet['valid-border'] : ''
                }`}                  />
            </div>
            {errors.name_project && <p className="text-red-500 text-sm">{errors.name_project}</p>}

            <div className="mb-4">
              <label htmlFor="country" className=" block text-sm font-medium text-gray-700">
              {t('common.selectCountry')}
              </label>
              <Flags
  selected={formData.country}
  onSelect={(countryCode: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country: countryCode,
    }));
    validateField("country", countryCode);
  }}
  searchable={true}
  className={`w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2  focus:border-primary ${
    errors.country ? sheet['error-border'] : formData.country.trim() !== '' ? sheet['valid-border'] : ''
  }`}    
  placeholder={i18n.language === 'fr'  ? 'Sélectionnez un pays' : 'Select a country'}

/>
            </div>
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

            <div className="mb-4">
              <label htmlFor="description_project" className=" block text-sm font-medium text-gray-700">
              {t('common.postDetails')}
              </label>
              <textarea
  id="description_project"
  name="description_project"
  value={formData.description_project}
  onChange={handleInputChange}
  className={`w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2  focus:border-primary ${
    errors.description_project ? sheet['error-border'] : formData.description_project.trim() !== '' ? sheet['valid-border'] : ''
  }`}
  rows={4}
/>
            </div>
            {errors.description_project && <p className="text-red-500 text-sm">{errors.description_project}</p>}

          </div>
          <div className="w-1/2 pl-4">
            <div className="mb-4">
              <label htmlFor="legalField" className=" block text-sm font-medium text-gray-700">{t('common.legalField')}</label>
              <select
                id="legalField"
                name="legalField"
                value={formData.legalField}
                onChange={handleSelectChange}
                className={`w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2 focus:border-primary ${
                  errors.legalField ? sheet['error-border'] : formData.legalField.trim() !== '' ? sheet['valid-border'] : ''
                }`}              >
                <option value="">{t('common.selectLegal')}</option>
                <option value="family">{t('common.family')}</option>
                <option value="criminal">{t('common.criminal')}</option>
                <option value="realEstate">{t('common.realEstate')}</option>
              </select>
            </div>
            {errors.legalField && <p className="text-red-500 text-sm">{errors.legalField}</p>}

            <div className="mb-4">
            {previewImages && <img src={previewImages}  style={{ borderRadius: '50%', maxWidth: '50px', height: '50px' }} />}
              <label className=" block text-sm font-medium text-gray-700">{t('common.uploadImages')}</label>
              <input
                type="file"
                name="images"
                accept=".jpg,.jpeg,.png"
                id="upload"
                className={`w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2 focus:border-primary ${
                  errors.images ? sheet['error-border'] : formData.images.length > 0 ? sheet['valid-border'] : ''
                }`}              
                    multiple
                onChange={handleFileChange}
              />
            </div>
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            <div className="mb-4">
      <label htmlFor="anonym" className="block text-sm font-medium text-gray-700">
      {t('common.anonym')}
      </label>
      <Switch
        id="anonym"
        checked={formData.anonym}
        onChange={handleSwitchChange}
        className="mt-1"
      />
      <span className="ml-2 text-gray-600">
        {formData.anonym ?  t('common.yes')  :  t('common.no') }
      </span>
    </div>
            <div className="mb-4">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {t('common.update')} 
              </button>
            </div>
          </div>
        </div>
      </form>

      {isPopupVisible && (
        <div className="popup bg-green-500 text-white p-4 rounded ">
          {message}
        </div>
      )}
    </div>
  );
};

export default PostForm;
