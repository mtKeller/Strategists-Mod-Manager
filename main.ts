import {app, BrowserWindow, ipcMain} from 'electron';
import * as fs from 'fs';

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        darkTheme: true,
        show: false
    });
    win.loadURL('http://localhost:4200');
    win.once('ready-to-show', () => {
        win.show();
    });
}

app.on('ready', createWindow);

ipcMain.on('CLOSE_WINDOW', (event, args) => {
    console.log('CLOSE_WINDOW');
    win.close();
    event.sender.send('HIT', 'ME');
});

class FunctionLib {
    readFile = function() {
    fs.readFile('package.json', function(err, data) {
        if (err) {
            console.log('Error1', err);
        }
        console.log(data);
    });
    };
}
