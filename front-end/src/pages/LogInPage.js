import axios from 'axios';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useToken } from '../auth/useToken';

export const LogInPage = () => {
  const [, setToken] = useToken();
  const [errorMessage, setErrorMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const history = useHistory();
  const location = useLocation();

  const onLoginClicked = async () => {
    try {
      const response = await axios.post('/api/login', {
        email: emailValue,
        password: passwordValue,
      });

      const { token } = response.data;
      setToken(token);
      const { from } = location.state || { from: { pathname: '/dashboard' } };
      history.push(from);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      {errorMessage && <div className="fail">{errorMessage}</div>}
      <input
        type="text"
        placeholder="someone@gmail.com"
        value={emailValue}
        autoComplete="on"
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />

      <hr />

      <button onClick={onLoginClicked} disabled={!emailValue || !passwordValue}>
        Log In
      </button>
      <button onClick={() => history.push('/forgot-password')}>Forgot your password?</button>
      <button onClick={() => history.push('/signup')}>Don't have an account? Sign Up</button>
    </div>
  );
};
