const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,

			validate(val) {
				if (!validator.isEmail(val)) {
					throw new Error('Email is invalid');
				}
			}
		},
		age: {
			type: Number,
			default: 0
		},
		password: {
			type: String,
			required: true,
			minlength: 7
		},

		tokens: [
			{
				token: {
					type: String,
					required: true
				}
			}
		],
		avatar: {
			type: Buffer
		}
	},
	{
		timestamps: true
	}
);

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
	const user = this;
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.tokens;
	delete userObj.avatar;

	return userObj;
};

userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.statics.findByCredential = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('unable to login');
	}
	const isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) {
		throw new Error('unable to login');
	}

	return user;
};

userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.pre('remove', async function(next) {
	const user = this;

	await Task.deleteMany({ owner: user._id });

	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
