import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import { EmailVerificationLandingPage } from './pages/EmailVerificationLandingPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LogInPage } from './pages/LogInPage';
import { PasswordResetLandingPage } from './pages/PasswordResetLandingPage';
import { PleaseVerifyEmailPage } from './pages/PleaseVerifyEmailPage';
import { SignUpPage } from './pages/SignUpPage';
import { UserInfoPage } from './pages/UserInfoPage';

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/userinfo" exact>
          <UserInfoPage />
        </PrivateRoute>
        <PrivateRoute path="/" exact>
          <ExpensesPage />
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
      </Switch>
    </Router>
  );
};
