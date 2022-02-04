import { acceptSharingExpenseRoute } from './acceptSharingExpenseRoute';
import { addExpenseRoute } from './addExpenseRoute';
import { addNewExpenseCategoryRoute } from './addNewExpenseCategoryRoute';
import { addUserToTrustedListRoute } from './addUserToTrustedListRoute';
import { checkPasswordResetCodeValidityRoute } from './checkPasswordResetValidityRoute';
import { declineSharingExpenseRoute } from './declineSharingExpenseRoute';
import { deleteExpenseRoute } from './deleteExpenseRoute';
import { forgotPasswordRoute } from './forgotPasswordRoute';
import { getExpensesRoute } from './getExpensesRoute';
import { getMutuallyTrustedUsersRoute } from './getMutuallyTrustedUsersRoute';
import { getSettingsRoute } from './getSettingsRoute';
import { getSharedByRoute } from './getSharedByRoute';
import { getUsersRoute } from './getUsersRoute';
import { logInRoute } from './logInRoute';
import { resetPasswordRoute } from './resetPasswordRoute';
import { setSettingsRoute } from './setSettingsRoute';
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
  getExpensesRoute,
  getUsersRoute,
  getSettingsRoute,
  setSettingsRoute,
  deleteExpenseRoute,
  getMutuallyTrustedUsersRoute
];
