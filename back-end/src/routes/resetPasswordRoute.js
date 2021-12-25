import { getDbConnection } from '../db';
import bcrypt from 'bcrypt';

export const resetPasswordRoute = {
  path: '/api/users/:passwordResetCode/reset-password',
  method: 'put',
  handler: async (req, res) => {
    const { passwordResetCode } = req.params;
    const { newPassword } = req.body;

    const db = getDbConnection('react-auth-db');

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const result = await db
      .collection('users')
      .findOneAndUpdate(
        { passwordResetCode },
        { $set: { passwordHash: newPasswordHash }, $unset: { passwordResetCode: '' } }
      );

    if (result.lastErrorObject.n === 0) {
      return res.result(404).json({ message: 'No user found with this password reset code' });
    }

    res.sendStatus(200);
  },
};
