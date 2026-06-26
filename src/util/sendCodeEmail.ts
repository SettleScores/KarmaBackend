import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetCode = async (email: string, code: string) => {

console.log(`qqqq sendResetCode На пошту ${email} відправлено код: ${code}`);

/// TODO Реальні значення, коли буде домен
  await resend.emails.send({
    ///from: "onboarding@resend.dev",
    from: 'Karma App <support@karma-app.org>',
    ///to: "encore.vector@gmail.com",
    to: [email],
    subject: "Password Reset",
    html: `
        <h2>Password Reset</h2>
        <p>Your verification code:</p>
        <h1 style="letter-spacing: 5px; color: #4F46E5;">${code}</h1>
      `,
  });
};
