import * as fs from 'mz/fs';
import * as callbackFs from 'fs';
const path = require('path');
const archiver = require('archiver');
const request = require('request');
const mkdirp = require('mkdirp');
const glob = require('glob');

process.on('message', (action) => {
    switch (action.type) {
        case 'READ_FILE' : {
            readFile(action.payload);
            break;
        }
        case 'MAKE_PATH' : {
            makePath(action.payload);
            break;
        }
        case 'WRITE_FILE' : {
            writeFile(action.payload);
            break;
        }
        case 'SAVE_STATE' : {
            const payload = action.payload;
            payload[1].FileSystemState.data = null;
            writeFile(payload);
            break;
        }
        case 'READ_DIR' : {
            readDir(action.payload);
            break;
        }
        case 'GET_NATIVE_PC_MAP' : {
            getNativePcMap(action.payload);
            break;
        }
        case 'GET_MOD_FOLDER_MAP' : {
            getModFolderMap(action.payload);
            break;
        }
        case 'CREATE_MOD_DIRS' : {
            createModDirs(action.payload);
            break;
        }
        case 'ZIP_DIR' : {
            zipDir(action.payload);
            break;
        }
        case 'ZIP_FILES' : {
            zipFiles(action.payload);
            break;
        }
        case 'DOWNLOAD_FILE' : {
            downloadFile(action.payload);
            break;
        }
        default: {
            process.send({payload: 'No valid message passed!'});
        }
    }
});

function readFile(payload) {
    fs.readFile(payload)
        .then((data) => {
            let mhwDIR;
            const parsedData = JSON.parse(data.toString('utf8'));
            if (payload === 'appState.json') {
                const tempStore = (parsedData.MainState.mhwDirectoryPath || false);
                if (tempStore) {
                    mhwDIR = tempStore;
                } else {
                    mhwDIR = false;
                }
            }
            console.log('check', parsedData, mhwDIR);
            process.send({
                payload: [parsedData, mhwDIR]
            });
        })
        .catch(err => {
            console.log('ERROR', err);
            process.send({
                payload: [false, false]
            });
        });
}

function makePath(payload) {
    mkdirp(payload);
    process.send({payload: true});
}

function writeFile(payload) {
    // console.log('WRITE FILE: ', payload);
    callbackFs.writeFile(payload[0], JSON.stringify(payload[1], null, 2), (err) => {
        console.log('WRITING_FILE', payload);
        if (err) {
            console.log('ERROR', err);
            process.send({payload: false});
        } else {
            process.send({payload: true});
        }
    });
}

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
    console.log(srcpath);
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(p => fs.statSync(p).isDirectory())
        .filter(name => {
            if (name.indexOf('chunk') <= -1) {
                return true;
            }
            return false;
        });
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function readDir(payload) {
    let newMap = getDirectoriesRecursive(payload[0]);
    let nativePcExists = payload[1];
    let modFolderExists = payload[2];
    const mhwDIR = payload[0];
    if (!nativePcExists) {
        for (let i = 0; i < newMap.length; i++) {
            if (newMap[i].indexOf('nativePC') > -1) {
                nativePcExists = true;
            }
            if (newMap[i].indexOf('modFolder') > -1) {
                modFolderExists = true;
            }
        }
        if (!nativePcExists || !modFolderExists) {
            mkdirp(mhwDIR + '\\nativePC\\', (err) => {
                mkdirp(mhwDIR + '\\modFolder\\temp\\', (error) => {
                    newMap = getDirectoriesRecursive(mhwDIR);
                    process.send({payload: [newMap, nativePcExists, modFolderExists]});
                });
            });
        } else {
            process.send({payload: [newMap, nativePcExists, modFolderExists]});
        }
    } else {
        process.send({payload: [newMap, nativePcExists, modFolderExists]});
    }
}

function getDirContents(src, cb) {
    glob(src + '/**/*', cb);
}

function getNativePcMap(payload) {
    getDirContents(payload + '\\nativePC\\', (er, files) => {
        process.send({
            payload: files
        });
    });
}

function getModFolderMap(payload) {
    getDirContents(payload + '\\modFolder\\', (er, files) => {
        process.send({
            payload: files
        });
    });
}

function createModDirs(payload) {
    mkdirp(payload + '\\nativePC\\', (err) => {
        mkdirp(payload + '\\modFolder\\temp\\', (error) => {
            process.send({
                payload: true
            });
        });
    });
}

function zipDir(payload) {
    try {
        const fileName = payload[0];
        const dirPath = payload[1];
        const output = fs.createWriteStream(payload[2] + '/' + fileName + '.zip');
        const archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            process.send({
                payload: true
            });
        });
        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);

        let startDir = '';
        if (typeof dirPath === 'string') {
            const dirPathSplit = dirPath.split('/');
            if (dirPathSplit[dirPathSplit.length - 1] === '') {
                startDir = dirPathSplit[dirPathSplit.length - 2];
            } else {
                startDir = dirPathSplit[dirPathSplit.length - 1];
            }
            archive.directory(dirPath, startDir);
            archive.finalize();
        } else {
            for (let i = 0; i < dirPath.length; i++) {
                const modPathSplit = dirPath[i].split('/');
                if (modPathSplit[modPathSplit.length - 1] === '') {
                    startDir = modPathSplit[dirPath.length - 2];
                } else {
                    startDir = modPathSplit[dirPath.length - 1];
                }
                archive.directory(dirPath, startDir);
                archive.finalize();
            }
        }
    } catch (err) {
        process.send({
            payload: false
        });
        throw err;
    }
}

function zipFiles(payload) {
    try {
        const fileName = payload[0];
        const filePaths = payload[1];
        const output = fs.createWriteStream(payload[2] + '/' + fileName + '.zip');
        const archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            process.send({
                payload: true
            });
        });
        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);

        for (let i = 0; i < filePaths; i++) {
            const file = filePaths[i];
            archive.append(fs.createReadStream(file), { name: file.split('Monster Hunter World\\')[1] });
        }
        archive.finalize();
    } catch (err) {
        process.send({
            payload: false
        });
        throw err;
    }
}

function showProgress(received, total) {
    const percentage = (received * 100) / total;
    return percentage;
}

function downloadFile(payload) {
    // Save variable to know progress
    const file_url = payload[0];
    const targetPath = payload[1];
    const fileName = payload[2];
    let received_bytes = 0;
    let total_bytes = 0;

    const req = request({
        method: 'GET',
        uri: file_url
    });

    const out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length'], null);
        process.send({
            type: 'DOWNLOAD_MANAGER_START',
            payload: fileName
        });
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;
        process.send({
            type: 'DOWNLOAD_MANAGER_UPDATE',
            payload: [fileName, showProgress(received_bytes, total_bytes)]
        });
    });

    req.on('end', function() {
        process.send({
            type: 'DOWNLOAD_MANAGER_END',
            payload: fileName
        });
    });
}
