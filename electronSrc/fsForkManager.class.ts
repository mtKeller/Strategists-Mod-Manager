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
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: false
            },
            {
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: false
            }
        ];
    }
    io(action: Action, cb) {
        let sent = false;
        for (let i = 0; i < this.fileSystemForks.length; i++) {
            if (!this.fileSystemForks[i].blocked) {
                this.fileSystemForks[i].fork.send(action);
                this.fileSystemForks[i].fork.on('message', (adjective) => {
                    this.fileSystemForks[i].blocked = false;
                    cb(adjective);
                });
                this.fileSystemForks[i].blocked = true;
                sent = true;
            }
        }
        if (!sent) {
            const newFS = {
                fork: this.fork('./dist/out-tsc/fileSystem.js'),
                blocked: true
            };
            newFS.fork.send(action);
            newFS.fork.on('message', cb);
            this.fileSystemForks.push(newFS);
        }
    }
}
