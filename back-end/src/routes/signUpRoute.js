import { getDbConnection } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { sendEmail } from '../util/sendEmail';
import moment from 'moment';

export const signUpRoute = {
  path: '/api/signup',
  method: 'post',
  handler: async (req, res) => {
    const { email, password, userName } = req.body;

    const db = getDbConnection('react-auth-db');
    const user = await db.collection('users').findOne({ email });

    if (user) {
      return res.sendStatus(409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const emailVerificationString = uuid();

    const startingInfo = {
      hairColor: '',
      favoriteFood: '',
      bio: '',
    };

    const month = moment().format('MMMM');
    const year = moment().year();

    const result = await db.collection('users').insertOne({
      email,
      userName,
      passwordHash,
      info: startingInfo,
      isVerified: false,
      emailVerificationString,
      expenses: [],
    });

    const { insertedId } = result;

    try {
      await sendEmail({
        to: email,
        from: 'slvalx.apps@gmail.com',
        subject: 'Please verify your email address',
        text: `
          Thanks for signing up! In order to verify your email, please click here:
          http://localhost:3000/verify-email/${emailVerificationString}
        `,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }

    jwt.sign(
      {
        id: insertedId,
        email,
        info: startingInfo,
        isVerified: false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2d',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).json({ token });
      }
    );
  },
};
