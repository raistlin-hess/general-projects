import { app, BrowserWindow, Remote, ipcMain } from 'electron';
const path = require('path'),
	fs = require('fs');

class Store {
	constructor(opts) {
		// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
		// app.getPath('userData') will return a string of the user's app data directory path.
		const userDataPath = (app || Remote).getPath('userData');
		// We'll use the `configName` property to set the file name and path.join to bring it all together as a string
		this.path = path.join(userDataPath, opts.configName + '.json');
		
		this.data = this.parseDataFile(this.path, opts.defaults);
	}
	
	// This will just return the property on the `data` object
	get(key) {
		return this.data[key];
	}
	
	// ...and this will set it
	set(key, val) {
		this.data[key] = val;
		// Wait, I thought using the node.js' synchronous APIs was bad form?
		// We're not writing a server so there's not nearly the same IO demand on the process
		// Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
		// we might lose that data. Note that in a real app, we would try/catch this.
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}

	parseDataFile(filePath, defaults) {
		// We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
		// `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
		try {
			return JSON.parse(fs.readFileSync(filePath));
		} catch(error) {
			// if there was some kind of error, return the passed in defaults instead.
			return defaults;
		}
	}
}

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

const preferences = new Store({
	configName: 'preferences',
	defaults: {
		windowWidth: 800,
		windowHeight: 800,
		isMaximized: false,
		rootDir: '/'
	}
});

function savePreferences() {
	let { width, height } = mainWindow.getBounds();

	preferences.set('windowWidth', width);
	preferences.set('windowHeight', height);
	preferences.set('isMaximized', mainWindow.isMaximized());
}

function createWindow() {
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

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
	// to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
	mainWindow.on('resize', () => {
		// The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
		// the height, width, and x and y coordinates.
		let { width, height } = mainWindow.getBounds();
		// Now that we have them, save them using the `set` method. 
		preferences.set('windowWidth', width);
		preferences.set('windowHeight', height);
	});

	mainWindow.on('maximize', () => {
		preferences.set('isMaximized', mainWindow.isMaximized());
	});
	mainWindow.on('unmaximize', () => {
		preferences.set('isMaximized', mainWindow.isMaximized());
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if(mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('onExit', () => {
	savePreferences();
});