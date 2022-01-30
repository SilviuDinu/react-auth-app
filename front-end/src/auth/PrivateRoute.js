import { Redirect, Route } from 'react-router-dom';
import { useUser } from './useUser';
import Sidenav from '../components/Sidenav/Sidenav';

export const PrivateRoute = (props) => {
  const user = useUser();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Sidenav />
      <div className="dashboard-content">
        <Route {...props} />;
      </div>
    </>
  );
};
