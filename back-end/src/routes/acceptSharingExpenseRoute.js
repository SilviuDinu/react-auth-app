import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { ObjectID } from 'mongodb';
import { sendEmail } from '../util/sendEmail';

export const acceptSharingExpenseRoute = {
  path: '/api/expenses/:userId/accept-expense-sharing/:sharingCode',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, sharingCode } = req.params;

    const { expenseId } = req.body;

    console.log(userId, expenseId);

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

      try {
        const { amount, who, type, day, month, year, date, prettyDate } = userWhoSharedWithMe.expenses.find(
          (expense) => expense.id === expenseId && expense.sharingCode === sharingCode
        );

        const result = await db.collection('users').findOneAndUpdate(
          { _id: ObjectID(userId) },
          {
            $push: {
              expenses: {
                id: expenseId,
                amount,
                who,
                type,
                day,
                month,
                year,
                date,
                prettyDate,
                sharedBy: {
                  email: userWhoSharedWithMe.email,
                  id: userWhoSharedWithMe._id,
                  userName: userWhoSharedWithMe.userName,
                },
                sharedWith: null,
                sharingPending: false,
                sharingCode: null,
                sharingAccepted: false,
              },
            },
          },
          { returnOriginal: false, upsert: true }
        );

        const updateUserWhoSharedWithMe = await db.collection('users').findOneAndUpdate(
          { _id: ObjectID(userWhoSharedWithMe._id), 'expenses.id': expenseId },
          {
            $set: {
              'expenses.$.sharingPending': false,
              'expenses.$.sharingAccepted': true,
              'expenses.$.sharingCode': null,
            },
          },
          { returnOriginal: false }
        );

        if (updateUserWhoSharedWithMe.ok && updateUserWhoSharedWithMe.value && result.ok && result.value) {
          res.status(200).json({ status: 'sharing accepted successfully' });
          await sendEmail({
            to: userWhoSharedWithMe.email,
            from: 'slvalx.apps@gmail.com',
            subject: 'Expense sharing',
            text: `
                Hello there,          
    
                ${result.value.userName} (${result.value.email}) accepted your request to share expense ${expenseId}
      
                Best regards,
                Silviu
              `,
          });
          return;
        }
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      res.status(500).json({ message: 'Could not find any expense with the specified id' });
    });
  },
};
