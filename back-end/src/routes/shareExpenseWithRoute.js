import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { ObjectID } from 'mongodb';
import { sendEmail } from '../util/sendEmail';

export const shareExpenseWithRoute = {
  path: '/api/expenses/:userId/share-expense/:expenseId',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, expenseId } = req.params;

    const { email } = req.body;

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

      const userToShareWith = await db.collection('users').findOne({
        email,
      });

      if (!userToShareWith) {
        res.status(404).json({ message: 'Could not find specified user' });
      }

      if (userToShareWith.expenses.find((item) => item.id === expenseId)) {
        res.status(409).json({ message: 'Expense already shared with user' });
        return;
      }

      const isAlreadyShared = await db.collection('users').findOne({
        _id: ObjectID(userId),
        expenses: {
          $elemMatch: {
            id: expenseId,
            sharedWith: {
              $elemMatch: {
                id: ObjectID(userToShareWith._id),
                sharingAccepted: false,
              },
            },
          },
        },
      });

      const result = isAlreadyShared
        ? {
            ok: 1,
            value: isAlreadyShared,
          }
        : await db.collection('users').findOneAndUpdate(
            {
              _id: ObjectID(userId),
              'expenses.id': expenseId,
            },
            {
              $addToSet: {
                'expenses.$.sharedWith': {
                  email,
                  id: userToShareWith._id,
                  userName: userToShareWith.userName,
                  sharingPending: true,
                  sharingAccepted: false,
                  sharingCode: nanoid(24),
                },
              },
            },
            { returnOriginal: false, upsert: true }
          );

      if (result.ok && result.value) {
        const expenseFound = result.value.expenses.find((expense) => expense.id === expenseId);

        const { amount, who, title, category, hasReceipt, day, month, year, date, prettyDate, sharedWith } = expenseFound;

        const sharingIndex = sharedWith.findIndex((item) => {
          return item.id.toString() === userToShareWith._id.toString();
        });

        const { sharingCode } = sharedWith[sharingIndex] || {};

        const canBypassApproval = !!userToShareWith?.usersWhoCanShareExpensesWithoutApproval?.find(
          (user) => user.id?.toString() === userId
        );

        if (canBypassApproval) {
          sharedWith[sharingIndex].sharingPending = false;
          sharedWith[sharingIndex].sharingAccepted = true;

          await db.collection('users').findOneAndUpdate(
            { _id: ObjectID(userId), 'expenses.id': expenseId, 'expenses.sharedWith': { $elemMatch: { sharingCode } } },
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

          const sharing = await db.collection('users').findOneAndUpdate(
            { _id: ObjectID(userToShareWith._id) },
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
                  hasReceipt,
                  isPrimaryOwner: false,
                  sharedBy: {
                    email: result.value.email,
                    id: result.value._id,
                    userName: result.value.userName,
                  },
                  sharedWith: [],
                },
              },
            },
            { returnOriginal: false, upsert: true }
          );

          if (sharing.ok && sharing.value) {
            res.status(200).json({ status: 'shared successfully' });
            return;
          }

          res.status(500).json({ message: 'Could not share expense with the target user' });
        } else {
          try {
            const expenseQueryParams = new URLSearchParams({
              expenseId,
              sharingCode,
              sharedBy: result.value.userName,
            });
            await sendEmail({
              to: email,
              from: 'slvalx.apps@gmail.com',
              subject: 'Expense sharing',
              text: `
                Hello there,

                ${result.value.userName} (${result.value.email}) wants to share an expense with you.
                Please click the link below to accept or ignore this email to refuse:

                http://localhost:${
                  process.env.PORT || 8080
                }/dashboard/accept-expense-sharing?${expenseQueryParams.toString()}

                Best regards,
                Silviu
              `,
            });
          } catch (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          res.status(200).json({ status: 'shared successfully' });
          return;
        }
      }

      res.status(500).json({ message: 'Could not find any expense with the specified id' });
    });
  },
};
