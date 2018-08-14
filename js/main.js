'use strict';

// This is the data control module
var dataControllor = (function () {

	class Users {
		constructor(username, password) {
			this.username = username;
			this.password = password;
		}
	}


	const postData = (url = '', data = {}) => {
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

		//Regiester a new user
		addUser: function (username, password) {
			var newUser;
			newUser = new Users(username, password);

			// add to the user to the database
			return postData('http://127.0.0.1:5000/api/v1/auth/signup', newUser)
				.then(data => console.log(data))
				.catch(error => console.error(error));
		},

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
		userContianer: '.userContianer',
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
	var signUpInput;
	// function that sets up the events and the event variables
	var SetUpEventListner = function () {
		var DOM = uiController.getDomStrings();

		document.querySelector(DOM.submitButton).addEventListener('click', addUser);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which == 13) {
				addUser();
			}
		});

	};


	// Add the user to the app system
	var addUser = function () {
		signUpInput = uiController.getUserData();

		//add the item to the dataControllor
		dataControllor.addUser(signUpInput.username, signUpInput.password);
        
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