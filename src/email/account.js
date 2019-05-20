const sgMail = require('@sendgrid/mail');

const apiKey = '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';

sgMail.setApiKey(apiKey);

const sendWelcomeMail = (mail, name) => {
	sgMail.send({
		to      : mail,
		from    : 'omar@omar',
		subject : 'thanks for joining in',
		text    : `welcome to the app, ${name}. let me know how u get along with the app`
	});
};

module.exports = {
	sendWelcomeMail
};
