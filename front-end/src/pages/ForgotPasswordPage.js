import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const [emailValue, setEmailValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  const onSubmitClicked = async () => {
    try {
      await axios.put(`/api/forgot-password/${emailValue}`, { email: emailValue });
      setSuccess(true);
      setTimeout(() => {
        history.push('/login');
      }, 3500);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return success ? (
    <div className="container">
      <h1>Success!</h1>
      <p>Please check your email for a password reset link.</p>
    </div>
  ) : (
    <div className="container">
      <h1>Reset password</h1>
      <p>Please enter your email address and we'll send a password reset link there.</p>
      {errorMessage && <div className="fail">{errorMessage}</div>}
      <input
        type="text"
        placeholder="someone@gmail.com"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <button onClick={onSubmitClicked} disabled={!emailValue}>
        Reset password
      </button>
    </div>
  );
};
