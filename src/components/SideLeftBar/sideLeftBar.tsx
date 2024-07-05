import { useState, useEffect } from "react";
import {
  IoPersonOutline, IoSettingsOutline, IoLogOutOutline, IoCloudUploadOutline, IoChatbubblesOutline,
  IoNotificationsOutline, IoCalendarOutline, IoSettingsSharp, IoHomeOutline, IoChatbubbleEllipsesOutline
} from "react-icons/io5";
import { BiHome } from "react-icons/bi";
import { PiWechatLogoBold, PiWechatLogoLight } from "react-icons/pi";
import { BsPencilSquare } from "react-icons/bs";
import { FaRegPenToSquare } from "react-icons/fa6";
import { SlHome } from "react-icons/sl";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import axios from "axios";
import { useRouter } from 'next/router';

const SideLeftBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);
  const router = useRouter();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowText(window.innerWidth > 975);
      if (window.innerWidth <= 975) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('https://legality-back-production.up.railway.app/users/logout', {}, { withCredentials: true });
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 3000 00:00:00 GMT';
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <div className={`bg-white text-black h-full fixed top-0 left-0 z-10 transition-all duration-500 mt-16 font-serif ${collapsed ? 'w-16' : 'w-64'}`}>
      <ul className="mt-8 space-y-4">
        <li>
          <a href="/user" className={`flex items-center p-2 ${isActive('/user') ? 'bg-[#f8f8f8]' : ''}`}>
            <SlHome className="mr-3" size={22} />
            {showText && <span className="ml-2">Home</span>}
          </a>
        </li>
        <li>
          <a href="/user/postProblem" className={`flex items-center p-2 ${isActive('/user/postProblem') ? 'bg-[#f8f8f8]' : ''}`}>
            <HiOutlinePencilSquare className="mr-3" size={22} />
            {showText && <span className="ml-2">Post</span>}
          </a>
        </li>
        <li>
          <a href="/chat" className={`flex items-center p-2 ${isActive('/chat') ? 'bg-[#f8f8f8]' : ''}`}>
            <IoChatbubbleEllipsesOutline className="mr-3" size={22} />
            {showText && <span className="ml-2">Chat Inbox</span>}
          </a>
        </li>
        <li>
          <a href="/user/userProfile" className={`flex items-center p-2 ${isActive('/user/userProfile') ? 'bg-[#f8f8f8]' : ''}`}>
            <IoPersonOutline className="mr-3" size={22} />
            {showText && <span className="ml-2">Profile</span>}
          </a>
        </li>
        <li>
        <a href="/user/settings" className={`flex items-center p-2 ${isActive('/user/settings') ? 'bg-[#f8f8f8] rounded-lg' : ''}`}>
            <IoSettingsOutline  className="mr-3" size={22} />
            {showText && <span className="ml-2">Settings</span>}
          </a>
        </li>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <li className="mt-auto">
          <a onClick={handleLogout} className="flex items-center p-2 cursor-pointer">
            <IoLogOutOutline className="mr-3" size={22} />
            {showText && <span className="ml-2">Logout</span>}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideLeftBar;