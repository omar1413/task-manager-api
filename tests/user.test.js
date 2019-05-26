const request = require('supertest');
const User = require('../src/models/user');
const app = require('../src/app');
const { userOne, userOneId, userOneToken, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

afterEach(() => {
	console.log('after each');
});

test('should user signup', async () => {
	const responce = await request(app)
		.post('/users')
		.send({
			name: 'omar',
			email: 'omar@gmaill.com',
			password: 'helloworld!'
		})
		.expect(201);

	const user = await User.findById(responce.body.user._id);

	expect(user).not.toBeNull();

	expect(responce.body).toMatchObject({
		user: {
			name: user.name,
			email: user.email
		},
		token: user.tokens[0].token
	});
});

test('should get profile for user', async () => {
	await request(app).get('/users/me').set('Authorization', `Bearer ${userOneToken}`).send().expect(200);
});

test('should not login for unAuth user', async () => {
	await request(app).get('/users/me').send().expect(401);
});

test('should not login for not valid data', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: 'sasd',
			password: 'sadgggg'
		})
		.expect(400);
});

test('should login user', async () => {
	const responce = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);

	const user = await User.findById(responce.body.user._id);

	expect(user).not.toBeNull();

	expect(user.tokens[1].token).toBe(responce.body.token);
});

test('should delete user', async () => {
	const response = await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOneToken}`)
		.send()
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test('should upload avatar for user', async () => {
	const res = await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOneToken}`)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
	const res = await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOneToken}`)
		.send({
			name: 'omar',
			email: 'omar@hmmmm.cooo'
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user).toMatchObject({
		name: 'omar',
		email: 'omar@hmmmm.cooo'
	});
});

test('should not update with invalid user fields', async () => {
	const res = await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOneToken}`)
		.send({
			name: 'something',
			location: 'sontssss'
		})
		.expect(400);

	const user = await User.findById(userOneId);
	delete userOne.password;
	expect(user.toObject()).toMatchObject(userOne);
});
