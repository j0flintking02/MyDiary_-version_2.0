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
			token = sessionStorage.getItem('token');

			userEntries = entries('https://mydiary201808.herokuapp.com/api/v1/entries', token);
			return userEntries;
		}
	};
})();







// ui control module
var uiController = (function () {
	var DOMstrings = {
		entryDate: '.entryDate',
		entryTitle: '.entryTitle',
		entryContianer: '.events'
	};

	return {


		display: function (newEntries) {
	
			var placehloder, element, newData, newList;
			//create html string with the placeholder text
			element = DOMstrings.entryContianer;
			placehloder =
				`<div class="entry">
					<p>
						<strong>Date:</strong>
						<a class="entryDate" href="description.html?id=%id%">%entry_date%</a>
					</p>
					<h2 class ="entryTitle">%entry_title%</h2>
        		</div>`;
			newList = newEntries['entries'];
			newList.forEach(id => {
				//replace the placeholder text with actual data
				newData = placehloder.replace('%id%', id['entry id']);
				newData = newData.replace('%entry_date%', id['entry date']);
				newData = newData.replace('%entry_title%', id['title']);
				//Insert the html in to the 
				document.querySelector(element).insertAdjacentHTML('beforeend', newData);
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

	loadEntries = function () {
		entries = dataControllor.getEtries();
		entries.then(data => {
			uiController.display(data);
		})
			.catch(error => console.error(error));
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