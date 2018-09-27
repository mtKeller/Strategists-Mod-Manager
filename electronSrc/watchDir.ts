const chokidar = require('chokidar');

let watchNative = null;
let watchMod = null;

process.on('message', action => {
    console.log('MESSAGE, ', action);
    if (action.payload[1] === 'nativePC') {
        watchNative = chokidar.watch(action.payload, {persistent: true, interval: 500});
        watchNative.on('all', (eve, p) => {
            console.log(eve, p);
            process.send({
                payload: 'nativePC'
            });
        });
        watchNative.on('error', (err) => {
            process.send({
                payload: 'nativePC'
            });
        });
    } else if (action.payload[1] === 'modFolder') {
        watchMod = chokidar.watch(action.payload, {persistent: true, interval: 500});
        watchMod.on('all', (eve, p) => {
            console.log(eve, p);
            process.send({
                payload: 'modFolder'
            });
        });
        watchMod.on('error', (err) => {
            process.send({
                payload: 'modFolder'
            });
        });
    }
});
