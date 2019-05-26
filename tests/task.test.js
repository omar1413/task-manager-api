const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
	userOne,
	userOneId,
	userOneToken,
	setupDatabase,
	userTwo,
	taskOne,
	taskTwo,
	taskThree
} = require('./fixtures/db');

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

test('should get all tasks for user', async () => {
	const res = await request(app).get('/tasks').set('Authorization', `Bearer ${userOneToken}`).send().expect(200);

	expect(res.body.length).toEqual(2);
});

test('should not delete a task for other user', async () => {
	const res = await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);

	const task = await Task.findById(taskOne._id);
	expect(task).not.toBeNull();
});
