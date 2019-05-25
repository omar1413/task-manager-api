const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('connected successfully to db');
	})
	.catch((err) => {
		console.log('Error in db: ' + err);
	});
