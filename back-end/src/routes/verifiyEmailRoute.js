import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

export const verifyEmailRoute = {
  path: '/api/verify-email',
  method: 'put',
  handler: async (req, res) => {
    const { emailVerificationString } = req.body;

    const db = getDbConnection('react-auth-db');

    const result = await db.collection('users').findOne({ emailVerificationString });

    if (!result) {
      return res.status(401).json({ message: 'Email verification code is incorrect' });
    }

    const { _id: id, info, email, userName } = result;

    await db.collection('users').updateOne({ _id: ObjectID(id) }, { $set: { isVerified: true } });

    jwt.sign(
      { id, email, userName, isVerified: true, info },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
      (err, token) => {
        if (err) {
          return res.sendStatus(500);
        }
        res.status(200).json({ token });
      }
    );
  },
};
