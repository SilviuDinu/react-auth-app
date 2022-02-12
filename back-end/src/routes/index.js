import { acceptSharingExpenseRoute } from './acceptSharingExpenseRoute';
import { addExpenseRoute } from './addExpenseRoute';
import { addNewExpenseTypeRoute } from './addNewExpenseTypeRoute';
import { addUserToTrustedListRoute } from './addUserToTrustedListRoute';
import { checkPasswordResetCodeValidityRoute } from './checkPasswordResetValidityRoute';
import { declineSharingExpenseRoute } from './declineSharingExpenseRoute';
import { deleteExpenseRoute } from './deleteExpenseRoute';
import { forgotPasswordRoute } from './forgotPasswordRoute';
import { getExpensesRoute } from './getExpensesRoute';
import { getExpenseTypesRoute } from './getExpenseTypesRoute';
import { getMutuallyTrustedUsersRoute } from './getMutuallyTrustedUsersRoute';
import { getReceiptRoute } from './getReceiptRoute';
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
  addNewExpenseTypeRoute,
  declineSharingExpenseRoute,
  getSharedByRoute,
  getExpensesRoute,
  getUsersRoute,
  getSettingsRoute,
  setSettingsRoute,
  deleteExpenseRoute,
  getMutuallyTrustedUsersRoute,
  getExpenseTypesRoute,
  getReceiptRoute
];
