import { app, BrowserWindow, Menu, dialog } from 'electron';


const mainMenuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'Open Database',
            accelerator: 'CMDOrCtrl+O',
            click(item, focusedWindow) {
                openFolder(focusedWindow);
            }
        }
    ]
}]

let mainWindow: Electron.BrowserWindow;

function createWindow() {
     mainWindow = new BrowserWindow();
     
     Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
     
     mainWindow.loadURL(`file://${__dirname}/index.html`);     
     mainWindow.setTitle('CashSave home finance');
     mainWindow.maximize();
     mainWindow.webContents.openDevTools();
     
     mainWindow.on('close', () => {
         mainWindow = null;
     });
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

function openFolder(focusedWindow: Electron.BrowserWindow) {
    dialog.showOpenDialog(focusedWindow, { properties: ['openFile'] }, folder => {
        if (folder !== undefined && folder.length > 0) {
            //focusedWindow.webContents.send('open-folder-result', folder);
        }
    });
}