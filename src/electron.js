const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
var ifs = require('os').networkInterfaces();
const Server = require('ws').Server;

var serverAddress = Object.keys(ifs)
  .map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
  .filter(x => x)[0].address;


const PORT = process.env.PORT || 3000;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  const server = express().listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });

  const wsServer = new Server({ server });
  wsServer.on('connection', (ws) => {
    ws.on('close', () => console.log('Client disconnected,', server.address()));
    ws.on('message', handleMessageFromClient)
  });
  const handleMessageFromClient = data => {
    wsServer.clients.forEach(client => notifyClients(client, data));
  };
  const notifyClients = (client, data) => {
    client.send(JSON.stringify(data))
  };
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can includ