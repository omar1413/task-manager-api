const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
	description : {
		type : String
	},
	completed   : {
		type    : Boolean,
		default : false
	}
});

module.exports = Task;
