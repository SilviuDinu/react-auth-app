import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { EmailVerificationFail } from './EmailVerificationFail';
import { EmailVerificationSuccess } from './EmailVerificationSuccess';

export const EmailVerificationLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { emailVerificationString } = useParams();
  const [, setToken] = useToken();

  useEffect(() => {
    const loadVerification = async () => {
      try {
        const response = await axios.put('/api/verify-email', { emailVerificationString });
        const { token } = response.data;
        setToken(token);
        setIsSuccess(true);
        setIsLoading(false);
      } catch (err) {
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    loadVerification();
  }, [setToken, emailVerificationString]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <EmailVerificationFail />;
  }
  return <EmailVerificationSuccess />;
};
