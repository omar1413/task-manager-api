const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks', async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.patch('/tasks/:id', async (req, res) => {
	const allowedUpdates = [ 'description', 'completed' ];
	const updates = Object.keys(req.body);
	const validUpdate = updates.every((update) => allowedUpdates.includes(update));
	if (!validUpdate) {
		return res.status(400).send({ error: 'invaild update !' });
	}
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).send();
		}

		updates.forEach((update) => {
			task[update] = req.body[update];
		});

		await task.save();

		res.send(task);
	} catch (e) {
		res.status(400).send();
	}
});

router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).send();
		}

		res.send(task);
	} catch (e) {
		res.status(500).send(e);
	}
});

module.exports = router;