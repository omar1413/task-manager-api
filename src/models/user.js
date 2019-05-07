const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name     : {
		type     : String,
		required : true,
		trim     : true
	},
	email    : {
		type      : String,
		required  : true,
		trim      : true,
		lowercase : true,
		validate(val) {
			if (!validator.isEmail(val)) {
				throw new Error('Email is invalid');
			}
		}
	},
	age      : {
		type    : Number,
		default : 0
	},
	password : {
		type      : String,
		required  : true,
		minlength : 7
	}
});

userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
