import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';

export const addUserToTrustedListRoute = {
  path: '/api/users/:userId/add-trusted-user/',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;
    const { userName } = req.body;

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

      const trustedUser = await db.collection('users').findOne({ userName: userName });

      if (!trustedUser) {
        return res.status(404).json({ message: 'Could not find the specified user' });
      }

      const isMutualTrust = !!trustedUser.usersWhoCanShareExpensesWithoutApproval?.find(
        (user) => user.id.toString() == userId
      );

      const result = await db.collection('users').findOneAndUpdate(
        { _id: ObjectID(userId) },
        {
          $addToSet: {
            usersWhoCanShareExpensesWithoutApproval: {
              id: trustedUser._id,
              email: trustedUser.email,
              userName: trustedUser.userName,
              isMutualTrust: isMutualTrust,
            },
          },
        },
        { returnOriginal: false }
      );

      if (isMutualTrust) {
        const updateMutualTrust = await db.collection('users').findOneAndUpdate(
          { _id: trustedUser._id, 'usersWhoCanShareExpensesWithoutApproval.id': ObjectID(userId) },
          {
            $set: {
              'usersWhoCanShareExpensesWithoutApproval.$.isMutualTrust': isMutualTrust,
            },
          },
          {
            returnOriginal: false,
            upsert: true,
          }
        );

        const updateFriendsForTrustedUser = await db.collection('users').findOneAndUpdate(
          { _id: trustedUser._id },
          {
            $addToSet: {
              friends: { id: result.value._id, email: result.value.email, userName: result.value.userName },
            },
          },
          {
            returnOriginal: false,
            upsert: true,
          }
        );

        const updateFriendsForUser = await db.collection('users').findOneAndUpdate(
          { _id: ObjectID(userId) },
          {
            $addToSet: {
              friends: { id: trustedUser._id, email: trustedUser.email, userName: trustedUser.userName },
            },
          },
          { returnOriginal: false, upsert: true }
        );

        if (
          result.ok &&
          result.value &&
          updateFriendsForUser.ok &&
          updateFriendsForTrustedUser.ok &&
          updateMutualTrust.ok
        ) {
          res.status(200).json({ status: 'successfully updated friends list' });
          return;
        }
      }

      if (result.ok && result.value) {
        res.status(200).json({ status: 'success' });
        return;
      }

      res.status(500).json({ message: 'Could not update or insert record' });
    });
  },
};
