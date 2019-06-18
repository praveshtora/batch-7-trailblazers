import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailService.INVITATION_EMAIL_SENDER || 'youremail@address.com',
    pass: config.emailService.INVITATION_EMAIL_PASSWORD || 'yourPassword',
  },
});

const sendEmail = async (to, from, subject, bodyText = '', bodyHTML = '') => {
  try {
    const info = await transporter.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      text: bodyText, // plain text body
      html: bodyHTML, // html body
    });
    console.log(info);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default sendEmail;
