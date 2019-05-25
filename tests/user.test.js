const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
	console.log('before each');
});

afterEach(() => {
	console.log('after each');
});

test('should user signup', async () => {
	await request(app)
		.post('/users')
		.send({
			name: 'omar',
			email: 'omar@gmaill.com',
			password: 'helloworld!'
		})
		.expect(201);
});
