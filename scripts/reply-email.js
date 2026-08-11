require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function sendReply(toAddress, originalSubject) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
    from: '"Antigravity Auto-Agent" <' + process.env.EMAIL_USER + '>',
    to: toAddress,
    subject: `Re: ${originalSubject}`,
    text: `Hello Cindy!\n\nYour feature request (${originalSubject}) has been successfully processed, coded, tested, and deployed to production.\n\nYou should see the changes live on the app now.\n\nBest,\nYour friendly neighborhood AI`,
  });

  console.log("Reply sent: %s", info.messageId);
}

const to = process.argv[2] || 'mthompson6782@gmail.com';
const subj = process.argv[3] || 'New Feature Request';

sendReply(to, subj).catch(console.error);
