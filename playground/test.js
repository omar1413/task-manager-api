require('../src/db/mongoose');
const User = require('../src/models/User');

// User.findByIdAndUpdate('5ccafbdc47576a33386f429d', { age: 25 })
// 	.then((user) => {
// 		console.log(user);
// 		return User.countDocuments({ age: 27 });
// 	})
// 	.then((count) => {
// 		console.log(count);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});

const updateAgeAndCount = async (id, age) => {
	const user = await User.findByIdAndUpdate(id, { age });
	const count = await User.countDocuments({ age });

	return { count, user };
};
updateAgeAndCount('5ccafbdc47576a33386f429d', 27)
	.then((count) => {
		console.log(count);
	})
	.catch((e) => {
		console.log('err: ', e);
	});
