import { Redirect, Route, useLocation } from 'react-router-dom';
import { useUser } from './useUser';
import Sidenav from '../components/Sidenav/Sidenav';
import { ExpensesProvider } from '../contexts/expensesContext';
import { ExpenseTypesProvider } from '../contexts/expenseTypesContext';
import axios from 'axios';
import { useState } from 'react';

export const PrivateRoute = (props) => {
  const user = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const location = useLocation();

  axios.interceptors.response.use(
    function (successRes) {
      return successRes;
    },
    function (error) {
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
      }

      return Promise.reject(error);
    }
  );

  if (!user || !isAuthenticated) {
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
