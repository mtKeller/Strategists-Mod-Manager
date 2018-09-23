"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForkFileSystemManager = /** @class */ (function () {
    function ForkFileSystemManager(fork) {
        this.fork = fork;
        this.fileSystemForks = [
            {
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: false
            },
            {
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: false
            }
        ];
    }
    ForkFileSystemManager.prototype.io = function (action, cb) {
        var _this = this;
        var sent = false;
        var _loop_1 = function (i) {
            if (!this_1.fileSystemForks[i].blocked) {
                this_1.fileSystemForks[i].fork.send(action);
                this_1.fileSystemForks[i].fork.on('message', function (adjective) {
                    _this.fileSystemForks[i].blocked = false;
                    cb(adjective);
                });
                this_1.fileSystemForks[i].blocked = true;
                sent = true;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.fileSystemForks.length; i++) {
            _loop_1(i);
        }
        if (!sent) {
            var newFS = {
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: true
            };
            newFS.fork.send(action);
            newFS.fork.on('message', cb);
            this.fileSystemForks.push(newFS);
        }
    };
    return ForkFileSystemManager;
}());
exports.ForkFileSystemManager = ForkFileSystemManager;
//# sourceMappingURL=fsForkManager.class.js.map