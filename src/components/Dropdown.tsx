import React, { useState, useEffect } from 'react';
import UserInvitationsPage from '@/pages/user/notification';
import { IoNotificationsOutline } from 'react-icons/io5';
import axios from 'axios';

const DropdownNotification = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState(0);

  const fetchPendingInvitations = async () => {
    console.log(user);
    try {
      const response = await axios.get('https://legality-back-production.up.railway.app/invitations/invitations', {
        params: { userId: user.id_user },
      });

      if (response.status === 200) {
        setPendingInvitations(response.data.length);
      } else {
        console.error("Error fetching pending invitations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
    }
  };

  useEffect(() => {
    fetchPendingInvitations();
  }, [user]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    toggleDropdown();
    fetchPendingInvitations();
  };

  return (
    <div className="relative inline-block">
      <button
        id="dropdownNotificationButton"
        data-dropdown-toggle="dropdownNotification"
        className="text-black relative"
        type="button"
        onClick={handleClick}
      >
        <IoNotificationsOutline className="mr-3 cursor-pointer" size={25} />
        {pendingInvitations > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {pendingInvitations}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="dropdownNotification"
          className={`fixed   sm:top-8 sm:right-16 lg:top-12 lg:right-16 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-700 z-20 transform transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
         style={{top:'5rem', right:'0rem' }}
        >
          {/* <div className="px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            Notifications
          </div> */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <UserInvitationsPage fetchPendingInvitations={fetchPendingInvitations} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownNotification;
