'use strict';
// import { fs } from "fs";
const fs = require('fs');
const electron = require('electron');
const dialog = electron.remote;

const beginSearch = function() {
	debugger;
	console.log('Inspect "dialog". See whats available');
	dialog.showOpenDialog(function(filenames) {
		

		var fileName = fileNames[0];

		fs.readFile(fileName, 'utf-8', function (err, data) {
			document.getElementById("editor").value = data;
		});
	});
};