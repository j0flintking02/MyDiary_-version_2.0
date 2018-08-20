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
		})
			.then(response => response.json())
			.catch(error => console.error('Fetch Error =\n', error));
	};


	return {

		//login a user the application
		getEtries: function () {
			var userEntries, token, id, raw_url, url;
			raw_url = window.location.href;
			url = new URL(raw_url);
			id = url.searchParams.get('id');
			console.log(id);
            
			token = sessionStorage.getItem('token');

			userEntries = entries('http://127.0.0.1:5000/api/v1/entries/'+id, token);
			return userEntries;
		}
	};
})();







// ui control module
var uiController = (function () {
	var DOMstrings = {
		entryDate: '.entryDate',
		entryTitle: '.entryTitle',
		entryContianer: '.description'
	};

	return {


		display: function (newEntries) {
	
			var placehloder, element, newData, date, title, description;
			//create html string with the placeholder text
			element = DOMstrings.entryContianer;
			placehloder =
				`<p class="date">
                <strong>Date:</strong>
                <i>%date%</i>
            </p>
            <br>
            <br>
            <div class="description_title">
                <b>Title:</b>
                <span>%title%</span>
            </div>
            <p>
                %description%
            </p>
            `;
			date = newEntries['entry']['entry date'];
			title = newEntries['entry']['title'];
			description = newEntries['entry']['description'];
            
			//replace the placeholder text with actual data
			newData = placehloder.replace('%date%', date);
			newData = newData.replace('%title%', title);
			newData = newData.replace('%description%', description);
                
			//Insert the html in to the 
			document.querySelector(element).insertAdjacentHTML('beforeend',  newData);

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