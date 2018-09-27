export interface Action {
    type: string;
    payload: any;
}

export interface ForkState {
    fork: any;
    blocked: boolean;
}

export class ForkFileSystemManager {
    private fileSystemForks: Array<ForkState>;
    fork: any;
    constructor(fork) {
        this.fork = fork;
        this.fileSystemForks = [
            {
                fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
                blocked: false
            },
            // {
            //     fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
            //     blocked: false
            // }
        ];
    }
    io(action: Action, cb) {
        let sent = false;
        for (let i = 0; i < this.fileSystemForks.length; i++) {
            if (!this.fileSystemForks[i].blocked) {
                this.send(this.fileSystemForks[i].fork, action);
                this.on(this.fileSystemForks[i], cb);
                this.fileSystemForks[i].blocked = true;
                sent = true;
                break;
            }
        }
        if (!sent) {
            const newFS = {
                fork: this.fork('./dist/out-tsc/electronSrc/fileSystem.js'),
                blocked: true
            };
            this.send(newFS.fork, action);
            this.on(newFS, cb);
            this.fileSystemForks.push(newFS);
        }
    }
    send(forked, action) {
        forked.send(action);
    }
    on(forkState, cb) {
        forkState.fork.on('message', (adjective) => {
            // console.log(adjective);
            forkState.blocked = false;
            cb(adjective);
            this.reduce();
        });
    }
    kill() {
        for (let i = 0; i < this.fileSystemForks.length; i++) {
            this.fileSystemForks[i].fork.send({
                type : 'EXIT'
            });
            this.fileSystemForks[i].fork.kill('SIGINT');
            this.fileSystemForks[i].fork.disconnect();
        }
    }
    reduce() {
        const statusArray = [];
        for (let i = 0; i < this.fileSystemForks.length; i++) {
            statusArray.push(this.fileSystemForks[i].blocked);
        }
        let open = 0;
        const newForkArray = [];
        for (let i = 0; i < statusArray.length; i++) {
            if (!statusArray[i] && open < 1) {
                open++;
                newForkArray.push(this.fileSystemForks[i]);
            } else if (open > 1 && !statusArray[i]) {
                this.fileSystemForks[i].fork.send({
                    type : 'EXIT'
                });
                this.fileSystemForks[i].fork.kill('SIGINT');
                this.fileSystemForks[i].fork.disconnect();
            } else if (statusArray[i]) {
                newForkArray.push(this.fileSystemForks[i]);
            }
        }
        this.fileSystemForks = newForkArray;
        // console.log(statusArray);
    }
}
