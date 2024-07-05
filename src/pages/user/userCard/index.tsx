import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiUser, FiLogOut, FiSettings } from 'react-icons/fi'; // Importation des icônes

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState({ firstName_user: '', lastName_user: '', email_user: '', avatar_url: '' });
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowText(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);

    handleResize();
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

  return (
    <div className={`flex font-serif`}>
  {user && (
    <div>
      <div className="mb-4 rounded-lg border bg-white p-4 shadow-md" style={{ width: '300px'}}>
        <div className="flex items-center p-4">
          <div className="">
            <p className="font-bold text-lg mb-1">{user.firstName_user} {user.lastName_user}</p>
            <p className="text-sm text-gray-500">{user.email_user}</p>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default Profile;
