const chokidar = require('chokidar');

process.on('message', action => {
    const watcher = chokidar.watch(action.payload, {persistent: true, interval: 100});
    watcher.on('all', (eve, p) => {
        // console.log(event, p);
        process.send({
            payload: action.payload[1]
        });
    });
    watcher.on('error', (err) => {
        process.send({
            payload: action.payload[1]
        });
    });
});
