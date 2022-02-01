import { useHistory } from 'react-router-dom';

export const PasswordResetSuccess = () => {
  const history = useHistory();

  return (
    <div className="container">
      <h1>Success!</h1>
      <p>You have successfully reset your password ❤️!</p>
      <button onClick={() => history.push('/login')}>Back to Login</button>
    </div>
  );
};
