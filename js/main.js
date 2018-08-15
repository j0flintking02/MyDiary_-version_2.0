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
			var newUser, message;

			newUser = new Users(username, password);

			// add to the user to the database
			message = postData('http://127.0.0.1:5000/api/v1/auth/signup', newUser);
			return message;
		},
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
<<<<<<< HEAD
	var signUpInput, message,SetUpEventListner,addUser;
=======
	var DOM,signUpInput, message,SetUpEventListner,addUser;
>>>>>>> ft-loginUser-01


	// function that sets up the events and the event variables
	SetUpEventListner = function () {
<<<<<<< HEAD
		var DOM = uiController.getDomStrings();
=======
		DOM = uiController.getDomStrings();
>>>>>>> ft-loginUser-01

		document.querySelector(DOM.submitButton).addEventListener('click', addUser);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which == 13) {
				addUser();
			}
		});

	};

	// Add the user to the app system
	addUser = function () {
		signUpInput = uiController.getUserData();

		//add the item to the dataControllor
		message = dataControllor.addUser(signUpInput.username, signUpInput.password);
		
		//redirect the user
		message.then(function (data) {
			if (data['message'] ==='new user created'){
				window.location.replace('file:///E:/projects/MyDiary_version_2.0/signin.html');
			}else{
				console.log('you have to login please');
			}
		})
			.catch(function(error){
				console.error(error);
			});

		//clear the ui fields
		uiController.clearField();

		
	};

	//login the user the app

	// add an entry to the app system
	return {
		init: function () {
			SetUpEventListner();
		}
	};
})(dataControllor, uiController);

//starts the program
controllor.init();