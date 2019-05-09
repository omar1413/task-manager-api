require('./db/mongoose');
const express = require('express');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const port = 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('server up and running on ' + port);
});

const jwt = require('jsonwebtoken');

const fun = async () => {
	const token = jwt.sign({ _id: 'hello' }, 'sec', { expiresIn: '5s' });

	console.log(token);

	const ver = jwt.verify(token, 'sec');

	console.log(ver);
};

fun();
