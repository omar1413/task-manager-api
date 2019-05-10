const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();

		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredential(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

		await req.user.save();

		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
	const allowedUpdates = [ 'name', 'age', 'email', 'password' ];
	const updates = Object.keys(req.body);

	const validUpdate = updates.every((update) => allowedUpdates.includes(update));

	if (!validUpdate) {
		return res.status(400).send({ error: 'invalid update !' });
	}
	try {
		const user = req.user;

		updates.forEach((update) => {
			user[update] = req.body[update];
		});

		await user.save();

		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send(e);
	}
});

module.exports = router;
