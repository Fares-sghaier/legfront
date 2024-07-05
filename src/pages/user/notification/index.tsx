import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layoutuser from "../../../app/layoutuser";
import { useRouter } from 'next/router';
import i18n from "../../../../i18n";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { fr } from 'date-fns/locale';

interface User {
  id_user: string;
  firstName_user: string;
  lastName_user: string;
  avatar_url?: string;
}

interface Invitation {
  id: number;
  sending_user_id: number;
  sending_user_firstName: string;
  sending_user_lastName: string;
  sending_avatar_url: string;
  name_project: string;
  created_at: string;
  id_project: number;
  invited_user_id: number;
}

const UserInvitationsPage = ( { fetchPendingInvitations }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const getLocale = () => {
    switch (i18n.language) {
      case 'fr':
        return fr;
      // Add more cases for other languages you want to support
      default:
        return undefined; // Default to English
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: User }>(
          "https://legality-back-production.up.railway.app/users/profile",
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        router.push('/signin');
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        if (user) {
          const response = await axios.post('https://legality-back-production.up.railway.app/users/invitations', { id_user: user.id_user });
          setInvitations(response.data.invitations);
          setNotificationsLoaded(true); // Mark notifications as loaded

        }
      } catch (error) {
        setError(error.response?.data.message || 'An error occurred while fetching invitations');
      }
    };

    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const handleAcceptInvitation = async (projectId: number, sendingUserId: number,inviteduserid: number) => {
    try {
      await axios.post("https://legality-back-production.up.railway.app/projects/acceptinvitationbyuserinvited", {
        id_user: sendingUserId,
        id_project: projectId,
        invited_user_id: inviteduserid,
      });
      // Mettre à jour localement le statut de l'invitation à "accepted"
      const updatedInvitations = invitations.filter(invitation => invitation.id_project !== projectId);
      setInvitations(updatedInvitations);   
    } catch (error) {
      console.error(`Error accepting invitation: ${error.message}`);
    }
  };
  const { t } = useTranslation()
  useEffect(() => {
    fetchPendingInvitations();
  }, [user]);
  const handleRejectInvitation = async (projectId: number, sendingUserId: number) => {
    try {
      await axios.post("https://legality-back-production.up.railway.app/projects/deleteinvitationbyuserinvited", {
        id_user: sendingUserId,
        id_project: projectId,
      });
  
      // Filtrer les invitations pour exclure celle qui vient d'être supprimée
      setInvitations(invitations.filter(invitation => invitation.id_project !== projectId));
    } catch (error) {
      console.error(`Error rejecting invitation: ${error.message}`);
    }
  };

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return `${interval} years`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} days`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} hours`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes`;
    }
    return `${Math.floor(seconds)} seconds`;
  };

  return (
    <Layoutuser>
      {error && <p>Error: {error}</p>}
      <div className="max-w-8xl mx-auto">
        {notificationsLoaded ? (
          invitations.length === 0 ? (
      <h1 className='font-bold text-base text-center' style={{ margin: '1rem' }}> {t('common.noNotifications')} </h1>
          ) : (
            invitations.map((invitation) => (
              <div key={invitation.id} className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow">
                <div className="flex">
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
                    {invitation.sending_avatar_url ? (
                      <img
                        src={invitation.sending_avatar_url}
                        className="h-full w-full rounded-full"
                        alt="User avatar"
                      />
                    ) : (
                      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-lg text-gray-600">
                          {invitation.sending_user_firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ms-4 ml-4 text-sm font-normal">
                    <span className="mb-1 text-sm font-semibold text-gray-900">{invitation.sending_user_firstName} {invitation.sending_user_lastName}</span>
                    <div className="mb-1 text-sm font-normal">{t('common.sentInvitation')}  {invitation.name_project}</div>
                    <div className="text-xs text-gray-500">{t('common.sent')}    {mounted ? formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true, locale: getLocale() }) : 'Loading...'}  
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <button onClick={() => {
                          handleAcceptInvitation(invitation.id_project, invitation.sending_user_id, invitation.invited_user_id);
                        }} className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">{t('common.accept')} </button>
                      </div>
                      <div>
                        <button onClick={() => {
                          handleRejectInvitation(invitation.id_project, invitation.sending_user_id);
                        }} className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">{t('common.reject')} </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Layoutuser>
  );
};

export default UserInvitationsPage;
