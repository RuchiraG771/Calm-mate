<<<<<<< HEAD
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any needed APIs here
=======
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Add any bridge functions here if needed in the future
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
>>>>>>> origin/main
});
