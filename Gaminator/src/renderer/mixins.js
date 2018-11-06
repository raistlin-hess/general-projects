module.exports = {
	methods: {
		savePreferences(newPreferences) {
			this.$electron.ipcRenderer.send('setPreferences', newPreferences);
		}
	}
}