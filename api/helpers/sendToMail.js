require("dotenv").config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');

let mg;

let domen;

function initMailGun() {
    console.log('mailgun started');
    domen = process.env.MAILGUN_DOMEN;

    const mailgun = new Mailgun(formData);

    mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
    });
    
}

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
        console.error(error.message);
        throw new Error('Mail service currently unavailable');
    }
}

module.exports = { sendMail, initMailGun };