const Path = require('path');
const {app, Remote } = require('electron');

module.exports = {
	methods: {
		savePreferences(newPreferences) {
			this.$electron.ipcRenderer.send('setPreferences', newPreferences);
		},
		formatPlaytime(timeInSeconds) {
			let hours = Math.floor(timeInSeconds / 3600);
			timeInSeconds %= 3600;
			let minutes = Math.floor(timeInSeconds / 60);
			let seconds = timeInSeconds % 60;
			
			minutes = String(minutes).padStart(2, "0");
			hours = String(hours).padStart(2, "0");
			seconds = String(seconds).padStart(2, "0");

			return `${hours}:${minutes}:${seconds}`;
		},
		getSubdirectories(parentPath, onlyFiles) {
			let FS = require('fs'),
				Path = require('path'),
				nodeChildren = [],
				files = FS.readdirSync(parentPath, {withFileTypes: true});

			for(let x = 0; x < files.length; x++) {
				let filePath = Path.join(parentPath, files[x]),
					fileStats = FS.statSync(filePath),
					name = files[x].replace(parentPath, '').replace(/^[/\\]/, ''),
					isFile = !fileStats.isDirectory();

				if(isFile) {
					nodeChildren.push({
						path: filePath,
						name: name,
						isFile: isFile,
						children: []
					});
				} else if(!onlyFiles) {
					nodeChildren.push({
						path: filePath,
						name: name,
						isFile: isFile,
						children: []
					});
				}
			}

			return nodeChildren;
		},
		updateGame(appDataDir, game) {
			let Nedb = require('nedb'),
				db = new Nedb({
					autoload: true,
					filename: Path.join(appDataDir, 'gameList.db')
				});

			db.find({gameId: game.gameId}, (err, records) => {
				if(err) {
					throw err;
				}
				
				let record = records[0];
				db.update({_id: record._id}, {$set: {
					playCount: game.playCount,
					playTime: game.playTime,
					rating: game.rating,
					ratingCount: game.ratingCount
				}}, (err, numReplaced) => {
					if(err) {
						throw err;
					}
				});
			});
		}
	}
}