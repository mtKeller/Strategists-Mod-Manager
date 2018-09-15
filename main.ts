import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import * as fs from 'mz/fs';
import * as callbackFs from 'fs';
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        darkTheme: true,
        show: false
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show();
    });
}

let mhwDIR = '';

app.on('ready', createWindow);

ipcMain.on('CLOSE_WINDOW', (event, args) => {
    win.close();
    app.exit();
    event.sender.send('HIT', 'ME');
});

ipcMain.on('READ_FILE', (event, args) => {
    fs.readFile(args)
        .then(data => {
            event.sender.send('FILE_READ', data);
        })
        .catch(err => {
            console.log('ERROR', err);
            event.sender.send('FILE_READ', false);
        });
});

ipcMain.on('WRITE_FILE', (event, args) => {
    if (args.indexOf('.json') > -1) {
        callbackFs.writeFile(args, null, (err) => {
            console.log('WRITING_FILE', args);
            if (err) {
                console.log('ERROR', err);
                event.sender.send('WROTE_FILE', true);
            } else {
                event.sender.send('WROTE_FILE', false);
            }
        });
    }
});
const findDir = function(event) {
    console.log('ENTERED');
    dialog.showOpenDialog({
        properties: ['openDirectory']
        }, (data) => {
        console.log('Index of MHW', data[0].indexOf('Monster Hunter World') > -1);
        if (data === undefined) {
            win.close();
            app.exit();
        } else if (data[0].indexOf('Monster Hunter World') > -1) {
            mhwDIR = data[0].slice(0, data[0]
                .indexOf('Monster Hunter World') + 20);
            event.sender.send('GOT_MHW_DIR_PATH', mhwDIR);
        } else {
            findDir(event);
        }
    });
};

ipcMain.on('GET_MHW_DIR_PATH', (event, args) => {
    console.log("HIT");
    findDir(event);
});

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(p => fs.statSync(p).isDirectory())
        .filter(name => {
            if (name.indexOf('chunk') <= -1) {
                return true;
            }
            return false;
    });
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

ipcMain.on('READ_DIR', (event, args) => {
    const newMap = getDirectoriesRecursive(mhwDIR);
    event.sender.send('DIR_READ', newMap);
});
