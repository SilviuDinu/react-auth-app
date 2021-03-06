import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

export const updateUserInfoRoute = {
  path: '/api/users/:userId',
  method: 'put',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const updates = (({ favoriteFood, hairColor, bio }) => ({
      favoriteFood,
      hairColor,
      bio,
    }))(req.body);

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
      const result = await db
        .collection('users')
        .findOneAndUpdate({ _id: ObjectID(id) }, { $set: { info: updates } }, { returnOriginal: false });

      const { email, info, userName } = result.value;

      jwt.sign({ id, email, userName, isVerified, info }, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
        if (err) {
          return res.status(401).json(err);
        }
        res.status(200).json({ token });
      });
    });
  },
};
