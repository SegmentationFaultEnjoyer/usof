require("dotenv").config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

const domen = process.env.MAILGUN_DOMEN;

async function sendMail(to, subject, text) {
    try {
        await mg.messages.create(domen, 
            {
                from: `USOF Support <postmaster@${process.env.MAILGUN_DOMEN}>`,
                to: [to],
                subject,
                text,
                html: `<a href="${text}">Reset Link</a>`
            })
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

module.exports = sendMail;