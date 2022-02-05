import { getDbConnection } from '../db';
import { v4 as uuid } from 'uuid';
import { sendEmail } from '../util/sendEmail';
import moment from 'moment';

export const forgotPasswordRoute = {
  path: '/api/forgot-password/:email',
  method: 'put',
  handler: async (req, res) => {
    const { email } = req.params;

    const db = getDbConnection('react-auth-db');
    const passwordResetCode = uuid();
    const passwordResetCodeDate = moment();

    const { result } = await db
      .collection('users')
      .updateOne({ email }, { $set: { passwordResetCode, passwordResetCodeDate } });

    if (!result) {
      return res.status(401).json({ message: 'No user with this email address' });
    }

    if (result.nModified > 0) {
      try {
        await sendEmail({
          to: email,
          from: 'slvalx.apps@gmail.com',
          subject: 'Password reset',
          text: `Hello there,          

            To reset your password, please click on this link:
            http://localhost:3000/reset-password/${passwordResetCode}

            This url is only available for 24 hours.

            Best regards,
            Silviu
          `,
        });
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      res.sendStatus(200);
    }
  },
};
