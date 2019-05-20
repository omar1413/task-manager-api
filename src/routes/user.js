const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

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
		console.log(e);
		res.status(400).send({ error: e.message });
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

const upload = multer({
	limits     : {
		fileSize : 7000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.toLocaleLowerCase().match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error('file should an image'));
		}

		cb(undefined, true);
	}
});

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		try {
			const buffer = await sharp(req.file.buffer)
				.resize({
					width : 500,
					heigh : 500
				})
				.png()
				.toBuffer();

			req.user.avatar = buffer;
			await req.user.save();

			res.send();
		} catch (e) {
			res.status(500).send({ error: e.message });
		}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set('Content-Type', 'image/png').send(user.avatar);
	} catch (e) {
		res.status(400).send({ error: 'there is no avatar' });
	}
});

router.patch('/users/:id', async (req, res) => {
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

router.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();

		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
