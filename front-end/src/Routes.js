import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
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
import { AcceptExpenseSharingPage } from './pages/AcceptExpenseSharingPage';
import ExpensesPage from './pages/ExpensesPage';
import SettingsPage from './pages/SettingsPage';
import AddExpenseCategoryPage from './pages/AddExpenseCategoryPage';

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
        <PrivateRoute path="/dashboard/settings" exact>
          <SettingsPage />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/expenses" exact>
          <ExpensesPage />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/share-expense" exact>
          <h1>Share expense page</h1>
        </PrivateRoute>
        <PrivateRoute path="/dashboard/add-expense-category" exact>
          <AddExpenseCategoryPage />
        </PrivateRoute>
        <PrivateRoute path="/dashboard/accept-expense-sharing" exact>
          <AcceptExpenseSharingPage />
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
        <Redirect exact={true} from={'/'} to={'/dashboard'} />
        <PrivateRoute>
          <NotFoundPage />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
