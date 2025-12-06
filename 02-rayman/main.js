const { app, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');

let mainWindow = null;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 80,
		frame: false,             // no OS frame
		transparent: true,        // nice overlay on macOS (and sometimes Win)
		show: false,              // start hidden
		resizable: false,
		fullscreenable: false,
		alwaysOnTop: true,
		skipTaskbar: true,
		focusable: true,
		titleBarStyle: 'hiddenInset', // macOS nice look
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true
		}
	});

	mainWindow.loadFile('index.html');

	mainWindow.on('blur', () => {
		// Hide when user clicks away (Raycast-style)
		if (!mainWindow.webContents.isDevToolsOpened()) {
			mainWindow.hide();
		}
	});
}

function togglePopup() {
	if (!mainWindow) return;

	if (mainWindow.isVisible()) {
		mainWindow.hide();
		return;
	}

	// Position near the top center of the main display
	const display = screen.getPrimaryDisplay();
	const { width, height } = mainWindow.getBounds();
	const x = Math.round(display.workArea.x + (display.workArea.width - width) / 2);
	const y = Math.round(display.workArea.y + display.workArea.height * 0.15); // 15% from top

	mainWindow.setBounds({ x, y, width, height });
	mainWindow.show();
	mainWindow.focus();
}

app.whenReady().then(() => {
	createMainWindow();

	// Global shortcut like Raycast (customize it)
	const ok = globalShortcut.register('CommandOrControl+Space', () => {
		togglePopup();
	});

	if (!ok) {
		console.error('Global shortcut registration failed');
	}

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createMainWindow();
		}
	});
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
	// Keep app alive in background on mac, quit on others
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
