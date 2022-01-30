import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import { Dashboard } from './pages/Dashboard';
import { EmailVerificationLandingPage } from './pages/EmailVerificationLandingPage';
import AddExpensesPage from './pages/AddExpensesPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LogInPage } from './pages/LogInPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PasswordResetLandingPage } from './pages/PasswordResetLandingPage';
import { PleaseVerifyEmailPage } from './pages/PleaseVerifyEmailPage';
import { SignUpPage } from './pages/SignUpPage';
import { UserInfoPage } from './pages/UserInfoPage';

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" exact>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/add-expense" exact>
          <AddExpensesPage />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/userinfo" exact>
          <UserInfoPage />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/share-expense" exact>
          <h1>Share expense page</h1>
        </PrivateRoute>
        <PrivateRoute path="/dashboard/add-expense-category" exact>
          <h1>Add expense category page</h1>
        </PrivateRoute>
        <Route path="/login" exact>
          <LogInPage />
        </Route>
        <Route path="/signup" exact>
          <SignUpPage />
        </Route>
        <Route path="/please-verify" exact>
          <PleaseVerifyEmailPage />
        </Route>
        <Route path="/verify-email/:emailVerificationString" exact>
          <EmailVerificationLandingPage />
        </Route>
        <Route path="/forgot-password" exact>
          <ForgotPasswordPage />
        </Route>
        <Route path="/reset-password/:passwordResetCode" exact>
          <PasswordResetLandingPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};
