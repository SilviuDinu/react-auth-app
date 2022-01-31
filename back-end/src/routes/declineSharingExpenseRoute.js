import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { sendEmail } from '../util/sendEmail';

export const declineSharingExpenseRoute = {
  path: '/api/expenses/:userId/decline-expense-sharing/:sharingCode',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, sharingCode } = req.params;

    const { expenseId } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: 'No auth token sent' });
    }

    const token = authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unable to verify token' });
      }

      const { id, isVerified } = decoded;

      if (id !== userId) {
        return res.status(403).json({ message: "Not allowed to update this users's data" });
      }

      if (!isVerified) {
        return res.status(403).json({ message: 'You need to verify your email before you can update your data' });
      }

      const db = getDbConnection('react-auth-db');

      const userWhoSharedWithMe = await db.collection('users').findOne({
        expenses: { $elemMatch: { id: expenseId, sharingCode } },
      });

      if (!userWhoSharedWithMe) {
        res.status(404).json({ message: 'Could not find specified user' });
        return;
      }

      const updateUserWhoSharedWithMe = await db.collection('users').findOneAndUpdate(
        { _id: ObjectID(userWhoSharedWithMe._id), 'expenses.id': expenseId },
        {
          $set: {
            'expenses.$.sharingPending': false,
            'expenses.$.sharingAccepted': false,
            'expenses.$.sharingCode': null,
          },
        },
        { returnOriginal: false }
      );

      if (updateUserWhoSharedWithMe.ok && updateUserWhoSharedWithMe.value) {
        try {
          const result = await db.collection('users').findOne({ _id: ObjectID(userId) });

          await sendEmail({
            to: userWhoSharedWithMe.email,
            from: 'slvalx.apps@gmail.com',
            subject: 'Expense sharing',
            text: `
              Hello there,          
  
              Unfortunately, ${result.userName} (${result.email}) declined your request to share expense ${expenseId}
    
              Best regards,
              Silviu
            `,
          });
        } catch (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        res.status(200).json({ status: 'sharing declined successfully' });
        return;
      }

      res.status(500).json({ message: 'Could not find any expense with the specified id' });
    });
  },
};
