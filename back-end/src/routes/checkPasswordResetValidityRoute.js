import { getDbConnection } from '../db';
import { hasUrlExpired } from '../util/hasUrlExpired';

export const checkPasswordResetCodeValidityRoute = {
  path: '/api/users/:passwordResetCode/forgot-password/verifiy',
  method: 'get',
  handler: async (req, res) => {
    const { passwordResetCode } = req.params;

    const db = getDbConnection('react-auth-db');

    const result = await db.collection('users').findOne({ passwordResetCode });

    if (!result) {
      return res.status(404).json({ message: 'Cannot find a user with this reset code' });
    }

    if (!hasUrlExpired(result.passwordResetCodeDate)) {
      res.status(200);
    } else {
      const result = await db
        .collection('users')
        .updateOne({ passwordResetCode }, { $unset: { passwordResetCode: '', passwordResetCodeDate: '' } });
      res.status(403).json({ message: 'This reset code has expired' });
    }
  },
};
