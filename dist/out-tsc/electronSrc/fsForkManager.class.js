"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForkFileSystemManager = /** @class */ (function () {
    function ForkFileSystemManager(fork) {
        this.fork = fork;
        this.fileSystemForks = [
            {
                fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
                blocked: false
            },
        ];
    }
    ForkFileSystemManager.prototype.io = function (action, cb) {
        var sent = false;
        for (var i = 0; i < this.fileSystemForks.length; i++) {
            if (!this.fileSystemForks[i].blocked) {
                this.send(this.fileSystemForks[i].fork, action);
                this.on(this.fileSystemForks[i], cb);
                this.fileSystemForks[i].blocked = true;
                sent = true;
                break;
            }
        }
        if (!sent) {
            var newFS = {
                fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
                blocked: true
            };
            this.send(newFS.fork, action);
            this.on(newFS, cb);
            this.fileSystemForks.push(newFS);
        }
    };
    ForkFileSystemManager.prototype.send = function (forked, action) {
        forked.send(action);
    };
    ForkFileSystemManager.prototype.on = function (forkState, cb) {
        forkState.fork.on('message', function (adjective) {
            // console.log(adjective);
            forkState.blocked = false;
            cb(adjective);
            // this.reduce();
        });
    };
    ForkFileSystemManager.prototype.kill = function () {
        for (var i = 0; i < this.fileSystemForks.length; i++) {
            this.fileSystemForks[i].fork.send({
                type: 'EXIT'
            });
            this.fileSystemForks[i].fork.kill('SIGINT');
            this.fileSystemForks[i].fork.disconnect();
        }
    };
    ForkFileSystemManager.prototype.reduce = function () {
        var statusArray = [];
        for (var i = 0; i < this.fileSystemForks.length; i++) {
            statusArray.push(this.fileSystemForks[i].blocked);
        }
        var open = 0;
        var newForkArray = [];
        for (var i = 0; i < statusArray.length; i++) {
            if (!statusArray[i] && open < 1) {
                open++;
                newForkArray.push(this.fileSystemForks[i]);
            }
            else if (open > 1 && !statusArray[i]) {
                this.fileSystemForks[i].fork.send({
                    type: 'EXIT'
                });
                this.fileSystemForks[i].fork.kill('SIGINT');
                this.fileSystemForks[i].fork.disconnect();
            }
            else if (statusArray[i]) {
                newForkArray.push(this.fileSystemForks[i]);
            }
        }
        this.fileSystemForks = newForkArray;
        // console.log(statusArray);
    };
    return ForkFileSystemManager;
}());
exports.ForkFileSystemManager = ForkFileSystemManager;
//# sourceMappingURL=fsForkManager.class.js.map