'use strict';

// This is the data control module
var dataControllor = (function () {

	class Entries {
		constructor(title, description) {
			this.title = title;
			this.description = description;
		}
	}


	const entryDetails = (url = '', token, data = {}) => {
		return fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'x-access-token': token
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
		addEntry: function (title, description) {
			var entry,token, output;
			token = sessionStorage.getItem('token');
			entry = new Entries(title, description);
			output = entryDetails('https://mydiary201808.herokuapp.com/api/v1/entries', token, entry);
			return output;
		}

		
	};
})();







// ui control module
var uiController = (function () {
	var DOMstrings = {
		title: '#title',
		description: '#description',
		submitButton: '#submit',
	};

	return {

		// obtian the user information from the form
		getUserData: function () {
			return {
				title: document.querySelector(DOMstrings.title).value,
				description: document.querySelector(DOMstrings.description).value
			};
		},

		// clear the user ui
		clearField: function () {
			var fields, fieldArr;
			fields = document.querySelectorAll(DOMstrings.title + ',' + DOMstrings.description);
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
	var DOM, input, SetUpEventListner, addEntry, output;


	// function that sets up the events and the event variables
	SetUpEventListner = function () {
		DOM = uiController.getDomStrings();

		document.querySelector(DOM.submitButton).addEventListener('click', addEntry);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which == 13) {
				addEntry();
			}
		});

	};

	// log the user to the app system
	addEntry = function () {
		input = uiController.getUserData();

		//add the item to the dataControllor
		output = dataControllor.addEntry(input.title, input.description);

		//redirect the user
		output.then(function (data) {
			if (data) {
				window.location.replace('file:///E:/projects/MyDiary_version_2.0/events.html');
			} else {
				console.log('Complete the form before you try to continue');
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