const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const platform = require('os').platform();
// let isDev = !!process.env.IS_PROD;
let isDev = process.defaultApp || process.execPath.match(/[\\/]electron-prebuilt[\\/]/) || process.execPath.match(/[\\/]electron[\\/]/);
const appConfig = {
	serverRoot: isDev ? 'http://localhost:3000' : 'file://' + path.join(__dirname, '../build/'),
	index: isDev ? this.serverRoot : this.serverRoot + 'index.html'
};


//Keep reference to mainWindow.
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Welcome',
		width: 900,
		height: 680
	});
	mainWindow.loadURL(appConfig.serverRoot
		// isDev ? `file://${path.join(__dirname, "../build/index.html")}` : "http://localhost:3000"
	);
	mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if(process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if(mainWindow === null) {
		createWindow();
	}
});
