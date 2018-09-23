var chokidar = require('chokidar');
process.on('message', function (action) {
    var watcher = chokidar.watch(action.payload, { persistent: true, interval: 100 });
    watcher.on('all', function (eve, p) {
        // console.log(event, p);
        process.send({
            payload: action.payload[1]
        });
    });
    watcher.on('error', function (err) {
        process.send({
            payload: action.payload[1]
        });
    });
});
//# sourceMappingURL=watchDir.js.map