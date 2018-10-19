'use strict';
const fs = require('fs'),
	nodePath = require('path'),
	electron = require('electron'),
	dialog = electron.remote.dialog;



const selectBaseDir = function() {
	let directory = null;

	dialog.showOpenDialog({properties: ['openDirectory']}, (dir) => {
		if(dir) {
			dir.forEach((dirPath) => {
				fs.lstat(dirPath, (err, stats) => {
					if(err) {
						console.error('Error on '+ dirPath + ': ' + err);
					}

					if(stats.isDirectory()) {
						directory = dirPath;
					}
				});
			});
			document.getElementById('baseDir').innerHTML = directory;
		}
	});
};

const beginSearch = function() {
	
};