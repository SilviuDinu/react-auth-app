import { useHistory } from 'react-router-dom';

export const PasswordResetFail = (props) => {
  const history = useHistory();
  const { text = 'Something went wrong while trying to reset your password' } = props;

  return (
    <div className="container">
      <h1>Uh oh...</h1>
      <p>{text}</p>
      <button onClick={() => history.push('/login')}>Back to Login</button>
    </div>
  );
};
