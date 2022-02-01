import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const getSettingsRoute = {
  path: '/api/users/:userId/get-settings/',
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
        return res.status(403).json({ message: "Not allowed to update this users's data" });
      }

      if (!isVerified) {
        return res.status(403).json({ message: 'You need to verify your email before you can update your data' });
      }

      const db = getDbConnection('react-auth-db');

      let users = [];

      const result = await db.collection('users').findOne({
        _id: ObjectID(userId),
      });

      if (!result) {
        res.status(404).json({ message: 'Users not found' });
        return;
      }

      res.status(200).json({
        message: 'Settings retrieved successfully',
        settings: result.settings,
      });
    });
  },
};
