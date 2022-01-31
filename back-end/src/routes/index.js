import { acceptSharingExpenseRoute } from './acceptSharingExpenseRoute';
import { addExpenseRoute } from './addExpenseRoute';
import { addNewExpenseCategoryRoute } from './addNewExpenseCategoryRoute';
import { addUserToTrustedListRoute } from './addUserToTrustedListRoute';
import { checkPasswordResetCodeValidityRoute } from './checkPasswordResetValidityRoute';
import { declineSharingExpenseRoute } from './declineSharingExpenseRoute';
import { forgotPasswordRoute } from './forgotPasswordRoute';
import { getExpensesRoute } from './getExpensesRoute';
import { getSharedByRoute } from './getSharedByRoute';
import { logInRoute } from './logInRoute';
import { resetPasswordRoute } from './resetPasswordRoute';
import { shareExpenseWithRoute } from './shareExpenseWithRoute';
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
  addExpenseRoute,
  shareExpenseWithRoute,
  acceptSharingExpenseRoute,
  addUserToTrustedListRoute,
  addNewExpenseCategoryRoute,
  declineSharingExpenseRoute,
  getSharedByRoute,
  getExpensesRoute
];
