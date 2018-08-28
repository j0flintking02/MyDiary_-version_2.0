'use strict';

// This is the data control module
var dataControllor = (function () {

	class Users {
		constructor(username, password) {
			this.username = username;
			this.password = password;
		}
	}


	const loginUser = (url = '', data = {}) => {
		return fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			redirect: 'follow',
			referrer: 'no-referrer',
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.catch(error => console.error('Fetch Error =\n', error));
	};


	return {

		//login a user the application
		loginUser: function (username, password) {
			var userDetails, token;
			userDetails = new Users(username, password);
			token = loginUser('https://mydiary201808.herokuapp.com/api/v1/auth/login', userDetails);
			return token;
		}

		//list the entries for the specific user

		// add a new entry to the data structure

		// retrive entries from the data structure

		// edit an entry from the data structure
	};
})();







// ui control module
var uiController = (function () {
	var DOMstrings = {
		user_name: '#userName',
		user_password: '#password',
		submitButton: '#submit',
	};

	return {

		// obtian the user information from the form
		getUserData: function () {
			return {
				username: document.querySelector(DOMstrings.user_name).value,
				password: document.querySelector(DOMstrings.user_password).value
			};
		},

		// clear the user ui
		clearField: function () {
			var fields, fieldArr;
			fields = document.querySelectorAll(DOMstrings.user_name + ',' + DOMstrings.user_password);
			fieldArr = Array.prototype.slice.call(fields);

			fieldArr.forEach(function (cur) {
				cur.value = '';
			});
		},

		getDomStrings: function () {
			return DOMstrings;
		},
	};

})();






// this controllor module that creates a connection btween other modules
var controllor = (function (dataControllor, uiController) {
	var DOM, signUpInput, SetUpEventListner, logUser, token;


	// function that sets up the events and the event variables
	SetUpEventListner = function () {
		DOM = uiController.getDomStrings();

		document.querySelector(DOM.submitButton).addEventListener('click', logUser);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which == 13) {
				logUser();
			}
		});

	};

	// log the user to the app system
	logUser = function () {
		signUpInput = uiController.getUserData();

		//add the item to the dataControllor
		token = dataControllor.loginUser(signUpInput.username, signUpInput.password);

		//redirect the user
		token.then(function (data) {
			if (data['token']) {
				sessionStorage.setItem('token', data['token']);
				
				window.location.replace('https://j0flintking02.github.io/MyDiary_version_2.0/events.html');
			} else {
				console.log('you have to login please');
			}
		})
			.catch(function (error) {
				console.error(error);
			});

		//clear the ui fields
		uiController.clearField();


	};

	// add an entry to the app system
	return {
		init: function () {
			SetUpEventListner();
		}
	};
})(dataControllor, uiController);

//starts the program
controllor.init();