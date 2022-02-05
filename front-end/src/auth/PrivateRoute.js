import { Redirect, Route, useLocation } from 'react-router-dom';
import { useUser } from './useUser';
import Sidenav from '../components/Sidenav/Sidenav';
import { ExpensesProvider } from '../contexts/expensesContext';
import { ExpenseTypesProvider } from '../contexts/expenseTypesContext';

export const PrivateRoute = (props) => {
  const user = useUser();
  const location = useLocation();

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
        <ExpenseTypesProvider>
          <div className="dashboard-content">
            <div className="content-container">
              <Route {...props} />
            </div>
          </div>
        </ExpenseTypesProvider>
      </ExpensesProvider>
    </div>
  );
};
