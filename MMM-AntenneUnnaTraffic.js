'use strict';

Module.register("MMM-AntenneUnnaTraffic", {

	jsonData: null,

	// Default module config.
	defaults: {
		url: "",
		arrayName: null,
		keepColumns: [],
		size: 0,
		tryFormatDate: false,
		updateInterval: 15000
	},

	start: function () {
		this.getJson();
		this.scheduleUpdate();
	},

	getStyles: function() {
		return ['font-awesome.css'];
	},

	getScripts: function() {
		return [
			'MMM-AntenneUnnaTraffic.css'
		];
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification("MMM-AntenneUnnaTraffic_GET_JSON", this.config.url);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-AntenneUnnaTraffic_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				this.updateDom(500);
			}
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "xsmall";

		if (!this.jsonData) {
			wrapper.innerHTML = "Daten werden geladen...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		
		var items = [];
		// if (this.config.arrayName) {
		// 	items = this.jsonData[this.config.arrayName];
		// }
		// else {
		// 	items = this.jsonData;
		// }

		console.log(this.jsonData);

		function pushToItems(icon, item, index) {
			//console.log(item['message']);
			//items.push('<i class="fas fa-car-crash"></i> ' + item['message']);
			var message = item['message'].replace(', ,',',');
			if(item['autobahn'] === undefined) {
				items.push({
					'icon' : icon,
					'data' : message
				});
			} else {
				if(item['direction'] === undefined) {
					items.push({
						'icon' : icon,
						'data' : item['autobahn'] + '<br />' + message
					});
				} else {
					items.push({
						'icon' : icon,
						'data' : item['autobahn'] + ': ' + item['direction'] + '<br />' + message
					});
				}
			}
		}

		if(this.config.arrayName === 'overregional.accident') {
			if (this.jsonData['overregional']['accident'] instanceof Array && this.jsonData['overregional']['accident'].length > 0) {
				this.jsonData['overregional']['accident'].forEach(function (item, index) {
					pushToItems('fa-car-crash', item, index)
				});
			} else {
				var noData = []
				noData.push({'message' : 'Es liegen keine aktuellen Meldungen über Unfälle vor. '});
				noData.forEach(function (item, index) {
					pushToItems('fa-smile-beam', item, index)
				});
			}
		}

		if(this.config.arrayName === 'overregional.construction') {
			if (this.jsonData['overregional']['construction'] instanceof Array && this.jsonData['overregional']['construction'].length > 0) {
				this.jsonData['overregional']['construction'].forEach(function (item, index) {
					pushToItems('fa-hard-hat', item, index)
				});
			} else {
				var noData = []
				noData.push({'message' : 'Es liegen keine aktuellen Meldungen über Baustellen vor. '});
				noData.forEach(function (item, index) {
					pushToItems('fa-smile-beam', item, index)
				});
			}
		}

		if(this.config.arrayName === 'overregional.trafficjam') {
			if (this.jsonData['overregional']['trafficjam'] instanceof Array && this.jsonData['overregional']['trafficjam'].length > 0) {
				this.jsonData['overregional']['trafficjam'].forEach(function (item, index) {
					pushToItems('fa-road', item, index)
				});
			} else {
				var noData = []
				noData.push({'message' : 'Es liegen keine aktuellen Meldungen über Staus vor. '});
				noData.forEach(function (item, index) {
					pushToItems('fa-smile-beam', item, index)
				});
			}
		}

		if(this.config.arrayName === 'overregional.warning') {
			if (this.jsonData['overregional']['warning'] instanceof Array && this.jsonData['overregional']['warning'].length > 0) {
				this.jsonData['overregional']['warning'].forEach(function (item, index) {
					pushToItems('fa-exclamation-triangle', item, index)
				});
			} else {
				var noData = []
				noData.push({'message' : 'Es liegen keine aktuellen Störungen vor. '});
				noData.forEach(function (item, index) {
					pushToItems('fa-smile-beam', item, index)
				});
			}
		}

		if(this.config.arrayName === 'local.radars') {
			if (this.jsonData['radars'] instanceof Array && this.jsonData['radars'].length > 0) {
				this.jsonData['radars'].forEach(function (item, index) {
					pushToItems('fa-camera', item, index)
				});
			} else {
				var noData = []
				noData.push({'message' : 'Es liegen keine aktuellen Meldungen über Blitzer vor. '});
				noData.forEach(function (item, index) {
					pushToItems('fa-smile-beam', item, index)
				});
			}
		}

		//console.log(this.jsonData['overregional']['accident'][0]['message']);

		// Check if items is of type array
		if (!(items instanceof Array)) {
			wrapper.innerHTML = "Json-Daten sind nicht vom Typ Array! " +
				"Möglicherweise wurde der Parameter arrayName nicht oder falsch konfiguriert?";
			return wrapper;
		}

		items.forEach(element => {
			var row = this.getTableRow(element);
			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		for (var key in jsonObject) {
			var cell = document.createElement("td");
			
			var valueToDisplay = "";
			if (key === "icon") {
				cell.classList.add("fa", jsonObject[key]);
			}
			else if (this.config.tryFormatDate) {
				valueToDisplay = this.getFormattedValue(jsonObject[key]);
			}
			else {
				if ( this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0 ){
					valueToDisplay = jsonObject[key];
				}
			}

			//var cellText = document.createTextNode(valueToDisplay);

			var cellText = document.createElement("span");
			cellText.innerHTML = valueToDisplay;


			if ( this.config.size > 0 && this.config.size < 9 ){
				var h = document.createElement("H" + this.config.size );
				h.appendChild(cellText)
				cell.appendChild(h);
			}
			else
			{
				cell.appendChild(cellText);
			}

			row.appendChild(cell);
		}
		return row;
	},

	// Format a date string or return the input
	getFormattedValue: function (input) {
		var m = moment(input);
		if (typeof input === "string" && m.isValid()) {
			// Show a formatted time if it occures today
			if (m.isSame(new Date(), "day") && m.hours() !== 0 && m.minutes() !== 0 && m.seconds() !== 0) {
				return m.format("HH:mm:ss");
			}
			else {
				return m.format("YYYY-MM-DD");
			}
		}
		else {
			return input;
		}
	}

});