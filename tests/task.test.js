const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userOneId, userOneToken, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should create task for user', async () => {
	const res = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${userOneToken}`)
		.send({ description: 'hello world' })
		.expect(201);

	const task = await Task.findById(res.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});
