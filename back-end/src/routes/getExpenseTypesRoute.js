import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getExpenseTypesRoute = {
  path: '/api/expense-types/:userId',
  method: 'get',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

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
        return res.status(403).json({ message: "Not allowed to view this users's data" });
      }

      const db = getDbConnection('react-auth-db');

      const result = await db.collection('users').findOne({
        _id: ObjectID(userId),
      });

      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Expenses retrieved successfully',
        expenseTypes: result.expenseTypes,
      });
    });
  },
};
