import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getSharedByRoute = {
  path: '/api/expenses/:userId/get-shared-by/:sharingCode',
  method: 'get',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId, sharingCode } = req.params;

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
        expenses: { $elemMatch: { sharingCode } },
      });

      if (!userWhoSharedWithMe) {
        res.status(404).json({ message: 'Could not find specified user' });
        return;
      }

      const result = await db.collection('users').findOne({
        _id: ObjectID(userId),
      });

      if (!result) {
        res.status(404).json({ message: 'You are not in our database' });
        return;
      }

      const isTrustedUser = !!result?.usersWhoCanShareExpensesWithoutApproval?.find(
        (user) => user.id === userWhoSharedWithMe._id
      );

      res
        .status(200)
        .json({ message: 'success', sharedBy: userWhoSharedWithMe.userName, sharedById: userWhoSharedWithMe._id, isTrustedUser });
    });
  },
};
