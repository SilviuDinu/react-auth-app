import { getDbConnection } from '../db';
import bcrypt from 'bcrypt';
import { hasUrlExpired } from '../util/hasUrlExpired';

export const resetPasswordRoute = {
  path: '/api/users/:passwordResetCode/reset-password',
  method: 'put',
  handler: async (req, res) => {
    const { passwordResetCode } = req.params;
    const { newPassword } = req.body;

    const db = getDbConnection('react-auth-db');

    const user = await db.collection('users').findOne({ passwordResetCode });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this password reset code' });
    }

    if (!hasUrlExpired(user.passwordResetCodeDate)) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      const result = await db
        .collection('users')
        .updateOne(
          { passwordResetCode },
          { $set: { passwordHash: newPasswordHash }, $unset: { passwordResetCode: '', passwordResetCodeDate: '' } }
        );

      res.sendStatus(200);
    } else {
      const result = await db
        .collection('users')
        .updateOne({ passwordResetCode }, { $unset: { passwordResetCode: '', passwordResetCodeDate: '' } });
      
        res.status(403).json({ message: 'Password reset code has expired' });
    }
  },
};
