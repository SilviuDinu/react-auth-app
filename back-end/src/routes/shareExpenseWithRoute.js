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

      const sharingCode = nanoid();

      const db = getDbConnection('react-auth-db');

      const userToShareWith = await db.collection('users').findOne({
        email,
      });

      if (!userToShareWith) {
        res.sendStatus(404).json({ message: 'Could not find specified user' });
      }

      const result = await db.collection('users').findOneAndUpdate(
        { _id: ObjectID(userId), 'expenses.id': expenseId },
        {
          $set: {
            'expenses.$.sharedWith': { email, id: userToShareWith._id, userName: userToShareWith.userName },
            'expenses.$.sharingPending': true,
            'expenses.$.sharingAccepted': false,
            'expenses.$.sharingCode': sharingCode,
          },
        },
        { returnOriginal: false }
      );

      if (result.ok && result.value) {
        try {
          await sendEmail({
            to: email,
            from: 'slvalx.apps@gmail.com',
            subject: 'Expense sharing',
            text: `
              Hello there,          
  
              ${result.value.userName} wants to share an expense with you. \
              Please click the link below to accept or ignore this email to refuse:
              
              cucu
    
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

      res.status(500).json({ message: 'Could not find any expense with the specified id' });
    });
  },
};
