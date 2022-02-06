import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { ObjectID } from 'mongodb';
import { sendEmail } from '../util/sendEmail';

export const acceptSharingExpenseRoute = {
  path: '/api/expenses/:userId/accept-expense-sharing/:sharingCodeParam',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, sharingCodeParam } = req.params;

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

      const db = getDbConnection('react-auth-db');

      const userWhoSharedWithMe = await db.collection('users').findOne({
        expenses: {
          $elemMatch: {
            id: expenseId,
            sharedWith: {
              $elemMatch: {
                id: ObjectID(userId),
                sharingAccepted: false,
                sharingCode: sharingCodeParam,
              },
            },
          },
        },
      });

      if (!userWhoSharedWithMe) {
        res.status(404).json({ message: 'Could not find specified user' });
        return;
      }

      try {
        const expenseFound = userWhoSharedWithMe.expenses.find(
          (expense) => expense.id === expenseId && expense.sharedWith.some((sh) => sh.sharingCode === sharingCodeParam)
        );

        const { amount, who, title, category, day, month, year, date, prettyDate, sharedWith } = expenseFound;

        const sharingIndex = sharedWith.findIndex((item) => {
          return item.id.toString() === userId.toString();
        });

        const result = await db.collection('users').findOneAndUpdate(
          { _id: ObjectID(userId) },
          {
            $addToSet: {
              expenses: {
                id: expenseId,
                amount,
                who,
                title,
                category,
                day,
                month,
                year,
                date,
                prettyDate,
                isPrimaryOwner: false,
                sharedBy: {
                  email: userWhoSharedWithMe.email,
                  id: userWhoSharedWithMe._id,
                  userName: userWhoSharedWithMe.userName,
                },
                sharedWith: [],
              },
            },
          },
          { returnOriginal: false, upsert: true }
        );

        sharedWith[sharingIndex].sharingPending = false;
        sharedWith[sharingIndex].sharingAccepted = true;

        const updateUserWhoSharedWithMe = await db.collection('users').findOneAndUpdate(
          {
            _id: ObjectID(userWhoSharedWithMe._id),
            'expenses.id': expenseId,
            'expenses.sharedWith': { $elemMatch: { sharingCode: sharingCodeParam } },
          },
          {
            $set: {
              [`expenses.$.sharedWith.${sharingIndex}.sharingPending`]: false,
              [`expenses.$.sharedWith.${sharingIndex}.sharingAccepted`]: true,
            },
          },
          {
            returnOriginal: false,
          }
        );

        if (updateUserWhoSharedWithMe.ok && updateUserWhoSharedWithMe.value && result.ok && result.value) {
          res.status(200).json({
            status: 'sharing accepted successfully',
            expense: {
              amount,
              who,
              title,
              category,
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
            },
          });
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
