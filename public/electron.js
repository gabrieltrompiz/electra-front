const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    width, 
    height,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false,
    darkTheme: true
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => { mainWindow = null; process.exit(0) });
  mainWindow.on('move', (e) => {
    if(mainWindow.isMaximized()) e.preventDefault();
  });
  mainWindow.show();
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});