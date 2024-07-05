import React from 'react';
import { useRouter } from 'next/router';

const Signout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Mettre en œuvre la déconnexion de l'utilisateur ici
    router.push('https://legality-back-production.up.railway.app/signout');
  };

  return (
    <div>
      <h1>Logout Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Signout;
