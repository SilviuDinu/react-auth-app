import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getUsersRoute = {
  path: '/api/users/:userId/get/:searchTerm',
  method: 'get',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, searchTerm } = req.params;

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

      let users = [];

      const result = await db
        .collection('users')
        .find({
          $or: [
            { email: { $regex: new RegExp(searchTerm, 'gi') } },
            { userName: { $regex: new RegExp(searchTerm, 'gi') } },
          ],
        })
        .limit(10)
        .toArray();

      if (!result) {
        res.status(404).json({ message: 'Users not found' });
        return;
      }

      res.status(200).json({
        message: 'Expenses retrieved successfully',
        users: result
          .filter((item) => item._id.toString() !== userId && !item.settings.isPrivateAccount)
          .map((user) => {
            const { userName, email } = user;
            return {
              userName,
              email,
            };
          }),
      });
    });
  },
};
