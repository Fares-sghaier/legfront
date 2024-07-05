// ActivationPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ActivationPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      const activation_token = router.query.activation_token as string;
      if (activation_token) {
        try {
          const response = await axios.post('https://legality-back-production.up.railway.app/users/activation', { activation_token });
          const data = response.data;
          setMessage(data.message);
        } catch (error) {
          console.error(error);
          setMessage('An error occurred. Please try again later.');
        }
      } else {
        setMessage('Activation token missing');
      }
    };

    activateAccount();
  }, [router.query.activation_token]);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        await axios.post('https://legality-back-production.up.railway.app/users/checktokenexpirationactivation', { token }); // Endpoint pour vérifier l'expiration du token
      } catch (error) {
        // Si le token est expiré, rediriger vers la page expired_reset_password
        router.push('http://localhost:3000/expired_activation_account');
      }
    };

    const token = router.query.activation_token as string;
    if (token) {
      checkTokenExpiration();
    }
  }, [router.query.activation_token]);

  return (
    <div>
      <h1>Account Activation</h1>
      <p>{message}</p>
    </div>
  );
};

export default ActivationPage;
