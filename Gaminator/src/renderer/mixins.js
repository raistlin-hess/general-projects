module.exports = {
	methods: {
		savePreferences(newPreferences) {
			this.$electron.ipcRenderer.send('setPreferences', newPreferences);
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
		}
	}
}