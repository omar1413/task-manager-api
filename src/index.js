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
