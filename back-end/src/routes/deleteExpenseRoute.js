import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';

export const deleteExpenseRoute = {
  path: '/api/expenses/:userId/delete/:expenseId',
  method: 'delete',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, expenseId } = req.params;

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
      const result = await db.collection('users').updateMany(
        {},
        {
          $pull: { expenses: { id: expenseId } },
        },
        false,
        true
      );

      console.log(result.result.ok);

      if (result.result.ok) {
        res.status(200).json({ status: 'success' });
        return;
      }

      res.status(500).json({ message: 'Could not update or insert record' });
    });
  },
};
