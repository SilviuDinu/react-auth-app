import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import axios from 'axios';
import { regex } from '../util/validators';

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

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    if (regex.alphaNumeric.test(value)) {
      setUserName(value);
    } else {
      setUserName(value.replace(regex.nonAlphaAndUnderscore, ''));
    }
  };

  return (
    <div className="container">
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
        placeholder={emailValue?.split('@')[0].replace(regex.nonAlphaAndUnderscore, '') || 'StarDestroyer123'}
        value={userName}
        autoComplete="off"
        onChange={handleUserNameChange}
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
