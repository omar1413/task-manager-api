const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOneToken = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET);

const userOne = {
	_id      : userOneId,
	email    : 'user@user.user',
	password : 'user123!!',
	name     : 'user one',
	tokens   : [
		{
			token : userOneToken
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwoToken = jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET);

const userTwo = {
	_id      : userTwoId,
	email    : 'user2@user2.user',
	password : 'user1ddggg23!!',
	name     : 'user two',
	tokens   : [
		{
			token : userTwoToken
		}
	]
};

const taskOne = {
	_id         : new mongoose.Types.ObjectId(),
	description : 'task one',
	completed   : false,
	owner       : userOneId
};

const taskTwo = {
	_id         : new mongoose.Types.ObjectId(),
	description : 'task two',
	completed   : false,
	owner       : userOneId
};

const taskThree = {
	_id         : new mongoose.Types.ObjectId(),
	description : 'task three',
	completed   : true,
	owner       : userTwoId
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	setupDatabase,
	userOne,
	userOneId,
	userOneToken,
	userTwo,
	taskOne,
	taskTwo,
	taskThree
};
