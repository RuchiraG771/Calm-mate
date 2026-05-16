const { app, BrowserWindow } = require('electron');
const path = require('path');
<<<<<<< HEAD
=======
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
>>>>>>> origin/main

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0a0a1f',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a1f',
      symbolColor: '#ffffff'
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "CalmMate Wellness",
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true,
  });

<<<<<<< HEAD
  console.log('Starting CalmMate in FORCE-DEV mode');
  mainWindow.loadURL('http://localhost:8080');
=======
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
>>>>>>> origin/main
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
