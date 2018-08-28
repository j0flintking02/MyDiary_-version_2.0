'use strict';

// This is the data control module
var dataControllor = (function () {

	class Entries {
		constructor(title, description) {
			this.title = title;
			this.description = description;
		}
	}


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
	const updateEntries = (url = '', token, data = {}) => {
		return fetch(url, {
			method: 'PUT',
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
		getEtries: function () {
			var userEntries, token, id, raw_url, url;
			raw_url = window.location.href;
			url = new URL(raw_url);
			id = url.searchParams.get('id');
			console.log(id);
            
			token = sessionStorage.getItem('token');

			userEntries = entries('https://mydiary201808.herokuapp.com/api/v1/entries/'+id, token);
			return userEntries;
		},

		// edit an entry 
		editEntry: function(title,description){
			var entry,token, output, id,raw_url,url;
			token = sessionStorage.getItem('token');
			entry = new Entries(title, description);
			raw_url = window.location.href;
			url = new URL(raw_url);
			id = url.searchParams.get('id');
			output = updateEntries('https://mydiary201808.herokuapp.com/api/v1/entries/'+id, token, entry);
			return output;

		}
	};
})();







// ui control module
var uiController = (function () {
	var DOMstrings = {
		entryDate: '.entryDate',
		entryTitle: '.entryTitle',
		entryContianer: '.description',
		updateModel: '#updateModel',
		submit:'#submit',
		title: '#title',
		description: '#description',
		submitButton: '#submit',
		update: '#update',
		close:'.close'
	};
	var model,placehloder, element, newData, date, title, description;
	model = document.querySelector(DOMstrings.updateModel);
	return {


		display: function (newEntries) {
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
			<button id="submit" type="submit">update description</button>
			
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
		
		displayModel: function(){
			model.style.display = 'block';
		},
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

		closeModel: function () {
			model.style.display = 'none';	
		},
		getDomStrings: function () {
			return DOMstrings;
		},
	};

})();






// this controllor module that creates a connection btween other modules
var controllor = (function (dataControllor, uiController) {
	var entries, loadEntries, SetUpEventListner, DOM,Model, input, output, sendUpdate, raw_url, url, id;


	// function that sets up the events and the event variables
	SetUpEventListner = function () {
		DOM = uiController.getDomStrings();		
		loadEntries();
	};

	loadEntries = function () {
		
		entries = dataControllor.getEtries();
		entries.then(data => {
			uiController.display(data);
			document.querySelector(DOM.submit).addEventListener('click', Model);
		})
			.catch(error => console.error(error));
	};

	sendUpdate= function(e){
		e.preventDefault();	
		
		input = uiController.getUserData();
		console.log(input);
		output = dataControllor.editEntry(input.title, input.description);

		output.then(function (data) {
			if (data) {
				console.log('update is complete');
				raw_url = window.location.href;
				url = new URL(raw_url);
				id = url.searchParams.get('id');
				window.location.replace('https://j0flintking02.github.io/MyDiary_version_2.0/description.html?id='+id);
			
			} else {
				console.log('Complete the form before you try to continue');
			}
		})
			.catch(function (error) {
				console.error(error);
			});
	};

	Model = function(){
		uiController.displayModel();
		document.querySelector(DOM.update).addEventListener('click', sendUpdate);
		

		//clear the ui fields
		uiController.clearField();

		document.querySelector(DOM.close).addEventListener('click', uiController.closeModel);		
		
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