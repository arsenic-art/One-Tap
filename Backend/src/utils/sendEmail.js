const { Resend } = require("resend");

let resendClient = null;
const getResend = () => {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing in environment variables");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: process.env.EMAIL_FROM_NAME,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;  
  }
};

module.exports = sendEmail;
