"use strict";

import { app, protocol, BrowserWindow, Tray } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let tray;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const getMenubarWindowPosition = (screen) => {
  try {
    const trayBounds = tray.getBounds();
    // Center menubarWindow horizontally below the tray icon
    let x = Math.round(trayBounds.x + trayBounds.width / 2 - 135); // need to figure out calculation here possibly, might be ok as is
    // Position menubarWindow 4 pixels vertically below the tray icon on Mac
    let y = Math.round(trayBounds.y + trayBounds.height + 4); // mac
    if (process.platform === "win32") {
      // windows
      x = Math.round(trayBounds.x + trayBounds.width / 2 - 100);
      y = Math.round(768 - 350);
    }
    return { x: x, y: y };
  } catch (error) {
    throw error;
  }
};

const toggleWindow = () => {
  if (win.isVisible()) {
    win.hide();
  } else {
    const position = getMenubarWindowPosition(win.getBounds());
    win.setPosition(position.x, position.y, true);
    win.show();
  }
};

const createTray = () => {
  tray = new Tray(__dirname + "\\logo.png");
  tray.on("click", function(event) {
    toggleWindow();
  });
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 250,
    height: 310,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode

    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("blur", () => {
    if (win.webContents.isDevToolsOpened()) {
      win.hide();
    }
  });

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// app.dock.hide();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      installVueDevtools();
    } catch (e) {
      throw e;
    }
  }
  createTray();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
