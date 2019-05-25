const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (mail, name) => {
	sgMail.send({
		to: mail,
		from: 'omar@omar',
		subject: 'thanks for joining in',
		text: `welcome to the app, ${name}. let me know how u get along with the app`
	});
};

module.exports = {
	sendWelcomeMail
};
