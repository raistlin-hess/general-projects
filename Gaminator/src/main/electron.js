import { app, BrowserWindow, Remote, ipcMain } from 'electron';
import Store from './store.js';
import FS from 'fs';
import Path from 'path';
import { spawn, exec } from 'child_process';	//https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a

//Global references
let mainWindow, childProcess, gameStartTime,
	wasForceClosed = false;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`;

//Create initial preferences
let appDataDir = Path.join((app || Remote).getPath('userData')),
	preferencesDir = Path.join(appDataDir, 'preferences.json');

FS.readFile(Path.join(__dirname, 'masterList.db'), (err, data) => {
	FS.writeFileSync(Path.join(appDataDir, 'masterList.db'), data);
});

const defaults = {
	windowWidth: 800,
	windowHeight: 800,
	isMaximized: false,
	appDataDir: appDataDir,
	procDirs: {
		n64: '',
		snes: '',
		nes: '',
		mame: ''
	},
	dirs: {
		n64: '',
		snes: '',
		nes: '',
		mame: ''
	}
};
if(!FS.existsSync(preferencesDir)) {
	console.log('Preferences does not exist.');
}
const preferences = new Store({
	configName: 'preferences',
	defaults: defaults
});

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
 * Function definitions
 */

function savePreferences(newPreferences) {
	if(newPreferences) {
		let { width, height } = mainWindow.getBounds();
		newPreferences.windowWidth = width;
		newPreferences.windowHeight = height;
		newPreferences.isMaximized = mainWindow.isMaximized();
		newPreferences.appDataDir = appDataDir;
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
	
	mainWindow.show();
	/**
	 * Events
	 */
	mainWindow.on('closed', () => {
		killAllEmulators();
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

function onChildExit(e, selectedGame) {
	let duration = new Date().getTime() - gameStartTime;
	duration = parseFloat((duration/1000).toFixed(0));

	e.sender.send('endGame', duration);
	childProcess = null;
	gameStartTime = null;
}

function killEmulatorByGame(selectedGame) {
	exec('tasklist /fo csv', (err, stdout, stderr) => {
		let list = stdout.split(/\r\n/),
			emulator = selectedGame.system.toLowerCase(),
			procDirs = preferences.get('procDirs'),
			targetProcessName = Path.basename(procDirs[emulator]).toLowerCase();

		for(let x = 0; x < list.length; x++) {
			let listProcess = list[x].toLowerCase(),
				listProcessArr = listProcess.replace(/"/g, '').split(','),
				listProcessName = listProcessArr[0],
				listProcessPid = parseInt(listProcessArr[1]);
			if(listProcessName === targetProcessName) {
				//Example of listProcess:
				//	"SearchProtocolHost.exe","21144","Services","0","11,808 K"
				process.kill(listProcessPid);
			}
		}
		onChildExit(e);
		wasForceClosed = true;
	});
}

function killAllEmulators() {
	let emulators = preferences.get('procDirs');
	for(let emulator in emulators) {
		let fakeGame = {
			system: emulator
		};
		killEmulatorByGame(fakeGame);
	}
}

/**
 * Main <-> Renderer Listeners
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

ipcMain.on('startGame', (e, selectedGame) => {
	if(childProcess) {
		e.sender.send('playGameError', 'There is already another game running.');
	}

	let emulator = selectedGame.system.toLowerCase(),
		procDirs = preferences.get('procDirs'),
		dirs = preferences.get('dirs'),
		processArgs = [],
		processName = `"${Path.join(procDirs[emulator])}"`,
		gameAbsPath = `"${Path.join(dirs[emulator], selectedGame.filename)}"`;

	switch(emulator) {
		case 'mame':
			processName = 'PAUSE';	//preferences.get('procDirs').mame;
			processArgs.push(gameAbsPath);
			break;
		case 'nes':
			processArgs.push(gameAbsPath);
			break;
		default:
			console.error(`Cannot play games with emulator: ${emulator}`);
			e.sender.send('playGameError', 'This emulator is not currently supported.');
			return;
	}

	gameStartTime = new Date().getTime();
	console.log(`Process: ${processName}\nGamePath: ${gameAbsPath}`);
	childProcess = spawn(processName, processArgs, {
		shell: true
	});

	childProcess.on('close', () => {
		if(!wasForceClosed) {
			onChildExit(e, selectedGame);
		}

		wasForceClosed = false;
	});
});

ipcMain.on('forceClose', (e, selectedGame) => {
	killEmulatorByGame(selectedGame);
});