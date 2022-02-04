import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getMutuallyTrustedUsersRoute = {
  path: '/api/users/:userId/get-trusted',
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
        return res.status(403).json({ message: 'Not allowed to search for trusted users' });
      }

      const db = getDbConnection('react-auth-db');

      const result = await db.collection('users').findOne({ _id: ObjectID(userId) });

      if (!result || !result.usersWhoCanShareExpensesWithoutApproval?.length) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Trusted users retrieved successfully',
        users: result.usersWhoCanShareExpensesWithoutApproval
          ?.filter((item) => item.isMutualTrust)
          .map((user) => {
            const { userName, email, firstName, lastName } = user;
            return {
              userName,
              email,
              firstName,
              lastName,
            };
          }),
      });
    });
  },
};
