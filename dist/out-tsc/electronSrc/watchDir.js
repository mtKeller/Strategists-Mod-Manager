var chokidar = require('chokidar');
var watchNative = null;
var watchMod = null;
process.on('message', function (action) {
    console.log('MESSAGE, ', action);
    if (action.payload[1] === 'nativePC') {
        watchNative = chokidar.watch(action.payload, { persistent: true, interval: 500 });
        watchNative.on('all', function (eve, p) {
            console.log(eve, p);
            process.send({
                payload: 'nativePC'
            });
        });
        watchNative.on('error', function (err) {
            process.send({
                payload: 'nativePC'
            });
        });
    }
    else if (action.payload[1] === 'modFolder') {
        watchMod = chokidar.watch(action.payload, { persistent: true, interval: 500 });
        watchMod.on('all', function (eve, p) {
            console.log(eve, p);
            process.send({
                payload: 'modFolder'
            });
        });
        watchMod.on('error', function (err) {
            process.send({
                payload: 'modFolder'
            });
        });
    }
});
//# sourceMappingURL=watchDir.js.map