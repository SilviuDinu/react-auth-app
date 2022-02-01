import { Redirect, Route, useLocation } from 'react-router-dom';
import { useUser } from './useUser';
import Sidenav from '../components/Sidenav/Sidenav';
import { ExpensesProvider } from '../contexts/expensesContext';

export const PrivateRoute = (props) => {
  const user = useUser();
  const location = useLocation();

  // http://localhost:3000/dashboard/accept-expense-sharing?expenseId=b0f1daf4-9ada-46d2-871e-482e87d00e00a1LTIvoGK98V0PUk4Bcya&sharingCode=fG3A3NdQX772DskB75URf&sharedBy=slvalx.apps+test3

  if (!user) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: { pathname: location.pathname, search: location.search } },
        }}
      />
    );
  }

  return (
    <div className="main-wrapper">
      <Sidenav />
      <ExpensesProvider>
        <div className="dashboard-content">
          <div className="content-container">
            <Route {...props} />
          </div>
        </div>
      </ExpensesProvider>
    </div>
  );
};
