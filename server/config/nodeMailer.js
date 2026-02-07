import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: process.env.BREVO_SENDER_EMAIL,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
};

export default sendEmail;
