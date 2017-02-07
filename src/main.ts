import { app, BrowserWindow, Menu, dialog } from 'electron';
import { financeStore } from './store/finance';


const mainMenuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'Import Database',
            accelerator: 'CMDOrCtrl+I',
            click(item, focusedWindow) {
                importDatabaseDialog(focusedWindow);
            }
        },
        {
            label: 'Export Database',
            accelerator: 'CMDOrCtrl+E',
            click(item, focusedWindow) {
                exportDatabaseDialog(focusedWindow);
            }
        }
    ]
}]

let mainWindow: Electron.BrowserWindow;

function createWindow() {
     mainWindow = new BrowserWindow({icon: `${__dirname}/assets/logo.png`});
     
     Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
     
     mainWindow.loadURL(`file://${__dirname}/index.html`);     
     mainWindow.setTitle('WIMM - Where Is My Money');
     mainWindow.maximize();
     if (process.argv.indexOf("console") >= 0) {
        mainWindow.webContents.openDevTools();
     }
     
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

function importDatabaseDialog(focusedWindow: Electron.BrowserWindow) {
    dialog.showOpenDialog(focusedWindow, { properties: ['openFile'] }, folder => {
        if (folder !== undefined && folder.length > 0) {
            //focusedWindow.webContents.send('open-folder-result', folder);
        }
    });
}

function exportDatabaseDialog(focusedWindow: Electron.BrowserWindow) {
    let date = new Date();
    dialog.showSaveDialog(focusedWindow, {
        title: 'Export database', 
        defaultPath: `wimmDB_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.zip`,
        filters: [
            { name: 'ZIP archive', extensions: ['zip'] }
        ]}, 
        fileName => {
            focusedWindow.webContents.send('db-export', fileName);
        });
}