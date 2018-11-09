import { app, BrowserWindow, Remote, ipcMain } from 'electron';
import Store from './store.js';
import fs from 'fs';
import path from 'path';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}
let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`;

//Create initial preferences
const defaults = {
	windowWidth: 800,
	windowHeight: 800,
	isMaximized: false,
	rootDir: '/'
};
let p = path.join((app || Remote).getPath('userData'), 'preferences.json');
if(!fs.existsSync(p)) {
	console.log('Preferences does not exist.');
}
const preferences = new Store({
	configName: 'preferences',
	defaults: defaults
});

function savePreferences(newPreferences) {
	if(newPreferences) {
		let { width, height } = mainWindow.getBounds();
		newPreferences.windowWidth = width;
		newPreferences.windowHeight = height;
		newPreferences.isMaximized = mainWindow.isMaximized();
	}

	preferences.set(newPreferences);
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: preferences.get('windowWidth'),
		height: preferences.get('windowHeight'),
		isMaximizable: true,
		autoHideMenuBar: true
	});
	mainWindow.loadURL(winURL);
	if(preferences.get('isMaximized')) {
		mainWindow.maximize();
	}
	
	/**
	 * Events
	 */
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
	mainWindow.on('resize', () => {
		let { width, height } = mainWindow.getBounds();
		preferences.set({
			windowWidth: width,
			windowHeight: height
		});
	});
	mainWindow.on('maximize', () => {
		preferences.set('isMaximized', mainWindow.isMaximized());
	});
	mainWindow.on('unmaximize', () => {
		preferences.set('isMaximized', mainWindow.isMaximized());
	});
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if(mainWindow === null) {
		createMainWindow();
	}
});

/**
 * Main <> Renderer Listeners
 */

ipcMain.on('onExit', () => {
	savePreferences();
});

ipcMain.on('getPreferences', (e, data) => {
	e.sender.send('getPreferences', preferences);
});

ipcMain.on('setPreferences', (e, data) => {
	savePreferences(data);
	e.sender.send('setPreferencesComplete');
});