import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { ObjectID } from 'mongodb';

export const addExpenseRoute = {
  path: '/api/expenses/:userId/add-new',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const { date: rawDate, amount, type, who } = req.body;

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

      const date = moment(rawDate);
      const day = date.date();
      const month = date.format('MMMM');
      const year = date.year();
      const prettyDate = date.format('LL');
      const expenseId = uuid() + nanoid();

      const db = getDbConnection('react-auth-db');
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
              sharedBy: null,
              sharedWith: null,
              sharingPending: false,
              sharingCode: null,
              sharingAccepted: false,
            },
          },
        },
        { returnOriginal: false, upsert: true }
      );

      if (result.ok && result.value) {
        res.status(200).json({ status: 'success' });
        return;
      }

      res.status(500).json({ message: 'Could not update or insert record' });
    });
  },
};
