import Profile from "@/pages/profile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoChatbubbleEllipsesOutline, IoChatbubblesOutline, IoNotificationsOutline, IoPersonAddOutline, IoSearchOutline } from "react-icons/io5";
import DropdownNotification from "../Dropdown";
import { BsChatText } from "react-icons/bs";
import { RiWechatLine } from "react-icons/ri";
import { TbUsersPlus } from "react-icons/tb";

interface User {
  firstname: string;
  lastname: string;
  id_user?: number;
}
const Headeruser: React.FC = ({user}) => {

  const [sticky, setSticky] = useState(false);


  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  return (
    <header
      className={`header bg-[#f8f8f8] flex w-full items-center font-serif border   ${sticky ? "fixed z-[9999] backdrop-blur-sm transition  " : "absolute bg-transparent"
      }`}
      style={{ padding: "0", margin: "0" }} // Ajoutez ces styles pour padding: 0 et margin: 0
    >
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between">
          <Link href="/user">
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
          <div className="flex items-center justify-between px-4">
            <div className="flex w-full max-w-[250px] items-center justify-between space-x-2 lg:w-auto lg:max-w-none lg:space-x-4">
              <div className="flex items-center space-x-4 ml-4">
                {/* <TbUsersPlus className="mr-3 cursor-pointer" size={25}/>
                <IoChatbubbleEllipsesOutline className="mr-3 cursor-pointer" size={25} /> */}
                <DropdownNotification user = {user}/>
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headeruser;
