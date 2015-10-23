
var Auth0Lock = require('auth0-lock');

function authenticate(callback) {

	var lock = new Auth0Lock(
		'Ie1dlpqy8TnIhAQyajPzVLyyq10IQZZL',
		'performanceroom.eu.auth0.com'
	);


	lock.show(function(err, profile, token) {
		if (err) {
			// Error callback
			console.log("There was an error");
			alert("There was an error logging in");
		} else {

			// Success calback

			alert(JSON.stringify(profile));
			//
			//// Save the JWT token.
			//localStorage.setItem('userToken', token);

		}
	});

}


module.exports = {
	authenticate: authenticate
};
