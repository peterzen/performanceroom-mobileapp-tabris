

function authenticate(callback) {
	OAuth.popup('facebook')
		.done(function (result) {
			callback(null, result);
		})
		.fail(function (error) {
			console.log(error);
			callback(error);
		});
}


module.exports = {
	authenticate: authenticate
};
