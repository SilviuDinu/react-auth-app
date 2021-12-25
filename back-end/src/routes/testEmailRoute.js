import { sendEmail } from '../util/sendEmail';

export const testEmailRoute = {
  path: '/api/test-email',
  method: 'post',
  handler: async (req, res) => {
    try {
      sendEmail({
        to: 'slvalx.apps+test1@gmail.com',
        from: 'slvalx.apps@gmail.com',
        subject: 'Email verification',
        text: 'Please click the link below to verify your email',
      })
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
        });

      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
};
