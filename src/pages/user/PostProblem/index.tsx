import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Layoutuser from "../../../app/layoutuser";
import SideLeftBar from "@/components/SideLeftBar/sideLeftBar";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Headeruser from "@/components/Headeruser";
import { ToastContainer } from "react-toastify";
import FriendsList from "../listamis";
import Flags from "react-flags-select";
import { useRouter } from 'next/router';
import { TbArrowBarToDown, TbArrowBarToUp } from "react-icons/tb";

interface User {
  firstname: string;
  lastname: string;
  id_user?: number;
}

interface Project {
  name_project: string;
  description_project: string;
  user_id_user?: number;
  images: string[];
  country: string;
  legalField: string;
  anonym: boolean;
}

const PostProblem = () => {
  const [countries, setCountries] = useState([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  const [formData, setFormData] = useState<Project>({
    name_project: "",
    description_project: "",
    user_id_user: 0,
    images: [],
    country: "",
    legalField: "",
    anonym:false,
  });

  const [user, setUser] = useState<User>({});
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: User }>(
          "https://legality-back-production.up.railway.app/users/profile",
          { withCredentials: true },
        );
        setUser(response.data.user);

        setFormData((prevData) => ({
          ...prevData,
          user_id_user: response.data.user.id_user,
        }));
      } catch (error) {
        router.push('/signin');
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

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


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://legality-back-production.up.railway.app/projects",
        formData,
      );
      console.log(response.data);
      setMessage("Post created successfully.");
      setError("");
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Error creating project. Please try again.");
      setMessage("");
    }
  };

  return (
    <Layoutuser>
      <div className="flex font-serif bg-[#f8f8f8]">
        <Headeruser />
        <ToastContainer />
        <div className="mx-auto w-1/2 p-4">
          <SideLeftBar />
          <br />
          <br />
          <br />
          <br />
          <div className="max-w-8xl mx-auto">
            <div className="mb-4 w-full px-4 py-8 ">
              <form
                onSubmit={handleSubmit}
                className="rounded bg-white p-8 shadow-md"
              >
                <h2 className="mb-4 font-serif text-2xl">Create Post</h2>
                {message || error ? (
                  <div
                    className={`${message ? "text-green-500" : "text-red-500"} mb-4 text-sm font-medium`}
                  >
                    {message || error}
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-6 rounded-lg border bg-white p-4 shadow-md md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name_project"
                      className="mb-1 block font-medium text-gray-600 "
                    >
                      Post Title
                    </label>
                    <input
                      type="text"
                      id="name_project"
                      name="name_project"
                      value={formData.name_project}
                      onChange={handleInputChange}
                      className="w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2 shadow-md focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block font-medium text-gray-600"
                    >
                      Select the country that you provide
                    </label>
                    <Flags
                      selected={formData.country}
                      onSelect={(countryCode: string) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          country: countryCode,
                        }))
                      }
                      searchable={true}
                      className="country-flag-select"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description_project"
                      className="mb-1 block font-medium text-gray-600"
                    >
                      Provide the Post details
                    </label>
                    <textarea
                      id="description_project"
                      name="description_project"
                      value={formData.description_project}
                      onChange={handleInputChange}
                      className="w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2 shadow-md focus:border-blue-500 focus:outline-none"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="legalField"
                      className="mb-1 block font-medium text-gray-600"
                    >
                      Legal Field
                    </label>
                    <select
                      id="legalField"
                      name="legalField"
                      value={formData.legalField}
                      onChange={handleInputChange}
                      className="w-full rounded-lg rounded-md border bg-white p-4 px-3 py-2 shadow-md focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select Legal Field</option>
                      <option value="family">Family Law</option>
                      <option value="criminal">Criminal Law</option>
                      <option value="realEstate">Real Estate Law</option>

                    </select>
                  </div>

                  <div>
                    <label className="pb-2">
                      Upload Images <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="images"
                      accept=".jpg,.jpeg,.png"
                      id="upload"
                      className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
                      multiple
                      onChange={handleFileChange}
                    />
                    <br />
                    <div>
                      <label
                        htmlFor="anonym"
                        className="mb-1 block font-medium text-gray-600"
                      >
                        Anonym
                      </label>
                      <input
                        type="checkbox"
                        id="anonym"
                        name="anonym"
                        checked={formData.anonym}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-600">
                        {formData.anonym ? "Anonyme" : "Non Anonyme"}
                      </span>
                    </div>

                    <div>
                      <input
                        type="submit"
                        value="Create"
                        className="mt-2 block h-[35px] w-full cursor-pointer appearance-none rounded-[3px] border border-gray-300 px-3 text-center placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="mb-4 w-full px-4 py-8 ">
              {/* Add your second div here */}
            </div>
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
    </Layoutuser>
  );
};

export default PostProblem;
