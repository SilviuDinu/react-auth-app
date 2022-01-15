import { addExpenseRoute } from './addExpenseRoute';
import { checkPasswordResetCodeValidityRoute } from './checkPasswordResetValidityRoute';
import { forgotPasswordRoute } from './forgotPasswordRoute';
import { logInRoute } from './logInRoute';
import { resetPasswordRoute } from './resetPasswordRoute';
import { signUpRoute } from './signUpRoute';
import { updateUserInfoRoute } from './updateUserInfoRoute';
import { verifyEmailRoute } from './verifiyEmailRoute';

export const routes = [
  signUpRoute,
  logInRoute,
  updateUserInfoRoute,
  verifyEmailRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  checkPasswordResetCodeValidityRoute,
  addExpenseRoute
];
