const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOneToken = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET);

const userOne = {
	_id: userOneId,
	email: 'user@user.user',
	password: 'user123!!',
	name: 'user one',
	tokens: [
		{
			token: userOneToken
		}
	]
};

const setupDatabase = async () => {
	await User.deleteMany();
	await new User(userOne).save();
};

module.exports = {
	setupDatabase,
	userOne,
	userOneId,
	userOneToken
};
