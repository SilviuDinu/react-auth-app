import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getReceiptRoute = {
  path: '/api/expenses/:userId/get-receipt/:expenseId',
  method: 'get',
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

      const { id } = decoded;

      if (id !== userId) {
        return res.status(403).json({ message: "Not allowed to update this users's data" });
      }

      const db = getDbConnection('react-auth-db');

      let users = [];

      const result = await db.collection('users').findOne({
        expenses: {
          $elemMatch: {
            id: expenseId,
            receiptData: { $exists: true },
            hasReceipt: true,
            $or: [{ 'sharedWith.id': ObjectID(userId) }, { isPrimaryOwner: true }],
          },
        },
      });

      if (!result) {
        res.status(404).json({ message: 'Users not found' });
        return;
      }

      const receiptData = result.expenses.find((exp) => {
        return (
          exp.id === expenseId &&
          exp.hasReceipt &&
          !!exp.receiptData &&
          (exp.sharedWith.some((sh) => sh.id.toString() === userId) || exp.isPrimaryOwner)
        );
      })?.receiptData;

      res.status(200).json({
        message: 'Settings retrieved successfully',
        receiptData,
      });
    });
  },
};
