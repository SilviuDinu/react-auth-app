import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import axios from 'axios';

export const SignUpPage = () => {
  const [, setToken] = useToken();
  const [errorMessage, setErrorMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [userName, setUserName] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const history = useHistory();

  const onSignUpClicked = async () => {
    try {
      const response = await axios.post('/api/signup', {
        email: emailValue,
        password: passwordValue,
        userName: userName || emailValue.split('@')[0],
      });

      const { token } = response.data;
      setToken(token);
      history.push('/please-verify');
    } catch (err) {
      setErrorMessage(err?.message || err);
    }
  };

  return (
    <div className="content-container">
      <h1>Sign Up</h1>
      {errorMessage && <div className="fail">{errorMessage}</div>}
      <input
        type="text"
        placeholder="someone@gmail.com"
        value={emailValue}
        autoComplete="on"
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <input
        type="text"
        placeholder={emailValue.split('@')[0] || 'StarDestroyer123'}
        value={userName}
        autoComplete="on"
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={confirmPasswordValue}
        onChange={(e) => setConfirmPasswordValue(e.target.value)}
      />

      <hr />

      <button
        onClick={onSignUpClicked}
        disabled={!emailValue || !passwordValue || passwordValue !== confirmPasswordValue}>
        Sign Up
      </button>
      <button onClick={() => history.push('/login')}>Already have an account? Log in</button>
    </div>
  );
};
