'use strict';

// This is the data control module
var dataControllor = (function () {

	const entries = (url = '', token) => {
		return fetch(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'x-access-token': token
			},
			redirect: 'follow',
			referrer: 'no-referrer',
		})
			.then(response => response.json())
			.catch(error => console.error('Fetch Error =\n', error));
	};


	return {

		//login a user the application
		getEtries: function () {
			var userEntries, token;
			token =sessionStorage.getItem('token');
	
			userEntries = entries('http://127.0.0.1:5000/api/v1/entries', token);
			return userEntries;
		}
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
	var entries, loadEntries, SetUpEventListner;


	// function that sets up the events and the event variables
	SetUpEventListner = function () {
		uiController.getDomStrings();
		loadEntries();
	};

	loadEntries = function(){
		entries = dataControllor.getEtries();
		entries.then(data => console.log(data)
		).catch(error => console.error(error));
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