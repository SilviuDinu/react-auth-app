import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PasswordResetFail } from './PasswordResetFail';

import { PasswordResetSuccess } from './PasswordResetSuccess';

export const PasswordResetLandingPage = () => {
  const [urlExpired, setUrlExpired] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const { passwordResetCode } = useParams();

  useEffect(async () => {
    try {
      await axios.get(`/api/users/${passwordResetCode}/forgot-password/verifiy`);
      setUrlExpired(false);
    } catch (err) {
      console.log(err);
      setUrlExpired(true);
    }
  }, [passwordResetCode]);

  const onResetClick = async () => {
    try {
      await axios.put(`/api/users/${passwordResetCode}/reset-password`, {
        newPassword: passwordValue,
      });
      setIsSuccess(true);
      setIsFailure(false);
    } catch (err) {
      setIsFailure(true);
      setIsSuccess(false);
    }
  };

  if (urlExpired) {
    return (
      <PasswordResetFail text="Looks like this password reset link is not valid or has expired. Please reset your password again." />
    );
  }

  if (isFailure) {
    return <PasswordResetFail />;
  }

  if (isSuccess) {
    return <PasswordResetSuccess />;
  }

  return (
    <div className="content-container">
      <h1>Reset Password</h1>
      <p>Please enter a new password</p>
      <input
        type="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        placeholder="password"
      />
      <input
        type="password"
        value={confirmPasswordValue}
        onChange={(e) => setConfirmPasswordValue(e.target.value)}
        placeholder="confirm password"
      />

      <button
        disabled={!passwordValue || !confirmPasswordValue || passwordValue !== confirmPasswordValue}
        onClick={onResetClick}>
        Reset password
      </button>
    </div>
  );
};
