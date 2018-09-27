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
            {
                fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
                blocked: false
            }
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
            forkState.blocked = false;
            // this.reduce();
            cb(adjective);
        });
    };
    ForkFileSystemManager.prototype.kill = function () {
        for (var i = 0; i < this.fileSystemForks.length; i++) {
            this.fileSystemForks[i].fork.kill('SIGINT');
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
            if (!statusArray[i]) {
                open++;
                newForkArray.push(this.fileSystemForks[i]);
            }
            else {
                newForkArray.push(this.fileSystemForks[i]);
            }
            if (open > 2 && !statusArray[i]) {
                this.fileSystemForks[i].fork.kill('SIGINT');
            }
        }
        this.fileSystemForks = newForkArray;
        // console.log(statusArray, this.fileSystemForks);
    };
    return ForkFileSystemManager;
}());
exports.ForkFileSystemManager = ForkFileSystemManager;
//# sourceMappingURL=fsForkManager.class.js.map