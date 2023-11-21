"use strict";
const nodemailer = require("nodemailer");

const sendEmail = async (toEmail,subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "tgsaran6@gmail.com",
            pass: "kiyf ubrr spqe xybp",
        },
    });

    const info = await transporter.sendMail({
        from: 'tgsaran6@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    });
    console.log("MEssage sent: %s", info);
};

module.exports = { sendEmail };
