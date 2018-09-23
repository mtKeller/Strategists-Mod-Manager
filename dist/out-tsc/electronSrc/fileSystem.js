"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("mz/fs");
var callbackFs = require("fs");
var path = require('path');
var archiver = require('archiver');
var request = require('request');
var mkdirp = require('mkdirp');
var glob = require('glob');
process.on('message', function (action) {
    switch (action.type) {
        case 'READ_FILE': {
            readFile(action.payload);
            break;
        }
        case 'MAKE_PATH': {
            makePath(action.payload);
            break;
        }
        case 'WRITE_FILE': {
            writeFile(action.payload);
            break;
        }
        case 'SAVE_STATE': {
            var payload = action.payload;
            payload[1].FileSystemState.data = null;
            writeFile(payload);
            break;
        }
        case 'READ_DIR': {
            readDir(action.payload);
            break;
        }
        case 'GET_NATIVE_PC_MAP': {
            getNativePcMap(action.payload);
            break;
        }
        case 'GET_MOD_FOLDER_MAP': {
            getModFolderMap(action.payload);
            break;
        }
        case 'CREATE_MOD_DIRS': {
            createModDirs(action.payload);
            break;
        }
        case 'ZIP_DIR': {
            zipDir(action.payload);
            break;
        }
        case 'ZIP_FILES': {
            zipFiles(action.payload);
            break;
        }
        case 'DOWNLOAD_FILE': {
            downloadFile(action.payload);
            break;
        }
        default: {
            process.send({ payload: 'No valid message passed!' });
        }
    }
});
function readFile(payload) {
    fs.readFile(payload)
        .then(function (data) {
        var mhwDIR;
        var parsedData = JSON.parse(data.toString('utf8'));
        if (payload === 'appState.json') {
            var tempStore = (parsedData.MainState.mhwDirectoryPath || false);
            if (tempStore) {
                mhwDIR = tempStore;
            }
            else {
                mhwDIR = false;
            }
        }
        console.log('check', parsedData, mhwDIR);
        process.send({
            payload: [parsedData, mhwDIR]
        });
    })
        .catch(function (err) {
        console.log('ERROR', err);
        process.send({
            payload: [false, false]
        });
    });
}
function makePath(payload) {
    mkdirp(payload);
    process.send({ payload: true });
}
function writeFile(payload) {
    // console.log('WRITE FILE: ', payload);
    callbackFs.writeFile(payload[0], JSON.stringify(payload[1], null, 2), function (err) {
        console.log('WRITING_FILE', payload);
        if (err) {
            console.log('ERROR', err);
            process.send({ payload: false });
        }
        else {
            process.send({ payload: true });
        }
    });
}
function flatten(lists) {
    return lists.reduce(function (a, b) { return a.concat(b); }, []);
}
function getDirectories(srcpath) {
    console.log(srcpath);
    return fs.readdirSync(srcpath)
        .map(function (file) { return path.join(srcpath, file); })
        .filter(function (p) { return fs.statSync(p).isDirectory(); })
        .filter(function (name) {
        if (name.indexOf('chunk') <= -1) {
            return true;
        }
        return false;
    });
}
function getDirectoriesRecursive(srcpath) {
    return [srcpath].concat(flatten(getDirectories(srcpath).map(getDirectoriesRecursive)));
}
function readDir(payload) {
    var newMap = getDirectoriesRecursive(payload[0]);
    var nativePcExists = payload[1];
    var modFolderExists = payload[2];
    var mhwDIR = payload[0];
    if (!nativePcExists) {
        for (var i = 0; i < newMap.length; i++) {
            if (newMap[i].indexOf('nativePC') > -1) {
                nativePcExists = true;
            }
            if (newMap[i].indexOf('modFolder') > -1) {
                modFolderExists = true;
            }
        }
        if (!nativePcExists || !modFolderExists) {
            mkdirp(mhwDIR + '\\nativePC\\', function (err) {
                mkdirp(mhwDIR + '\\modFolder\\temp\\', function (error) {
                    newMap = getDirectoriesRecursive(mhwDIR);
                    process.send({ payload: [newMap, nativePcExists, modFolderExists] });
                });
            });
        }
        else {
            process.send({ payload: [newMap, nativePcExists, modFolderExists] });
        }
    }
    else {
        process.send({ payload: [newMap, nativePcExists, modFolderExists] });
    }
}
function getDirContents(src, cb) {
    glob(src + '/**/*', cb);
}
function getNativePcMap(payload) {
    getDirContents(payload + '\\nativePC\\', function (er, files) {
        process.send({
            payload: files
        });
    });
}
function getModFolderMap(payload) {
    getDirContents(payload + '\\modFolder\\', function (er, files) {
        process.send({
            payload: files
        });
    });
}
function createModDirs(payload) {
    mkdirp(payload + '\\nativePC\\', function (err) {
        mkdirp(payload + '\\modFolder\\temp\\', function (error) {
            process.send({
                payload: true
            });
        });
    });
}
function zipDir(payload) {
    try {
        var fileName = payload[0];
        var dirPath = payload[1];
        var output = fs.createWriteStream(payload[2] + '/' + fileName + '.zip');
        var archive_1 = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        output.on('close', function () {
            console.log(archive_1.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            process.send({
                payload: true
            });
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });
        archive_1.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            }
            else {
                // throw error
                throw err;
            }
        });
        archive_1.on('error', function (err) {
            throw err;
        });
        archive_1.pipe(output);
        var startDir = '';
        if (typeof dirPath === 'string') {
            var dirPathSplit = dirPath.split('/');
            if (dirPathSplit[dirPathSplit.length - 1] === '') {
                startDir = dirPathSplit[dirPathSplit.length - 2];
            }
            else {
                startDir = dirPathSplit[dirPathSplit.length - 1];
            }
            archive_1.directory(dirPath, startDir);
            archive_1.finalize();
        }
        else {
            for (var i = 0; i < dirPath.length; i++) {
                var modPathSplit = dirPath[i].split('/');
                if (modPathSplit[modPathSplit.length - 1] === '') {
                    startDir = modPathSplit[dirPath.length - 2];
                }
                else {
                    startDir = modPathSplit[dirPath.length - 1];
                }
                archive_1.directory(dirPath, startDir);
                archive_1.finalize();
            }
        }
    }
    catch (err) {
        process.send({
            payload: false
        });
        throw err;
    }
}
function zipFiles(payload) {
    try {
        var fileName = payload[0];
        var filePaths = payload[1];
        var output = fs.createWriteStream(payload[2] + '/' + fileName + '.zip');
        var archive_2 = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        output.on('close', function () {
            console.log(archive_2.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            process.send({
                payload: true
            });
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });
        archive_2.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            }
            else {
                // throw error
                throw err;
            }
        });
        archive_2.on('error', function (err) {
            throw err;
        });
        archive_2.pipe(output);
        for (var i = 0; i < filePaths; i++) {
            var file = filePaths[i];
            archive_2.append(fs.createReadStream(file), { name: file.split('Monster Hunter World\\')[1] });
        }
        archive_2.finalize();
    }
    catch (err) {
        process.send({
            payload: false
        });
        throw err;
    }
}
function showProgress(received, total) {
    var percentage = (received * 100) / total;
    return percentage;
}
function downloadFile(payload) {
    // Save variable to know progress
    var file_url = payload[0];
    var targetPath = payload[1];
    var fileName = payload[2];
    var received_bytes = 0;
    var total_bytes = 0;
    var req = request({
        method: 'GET',
        uri: file_url
    });
    var out = fs.createWriteStream(targetPath);
    req.pipe(out);
    req.on('response', function (data) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length'], null);
        process.send({
            type: 'DOWNLOAD_MANAGER_START',
            payload: fileName
        });
    });
    req.on('data', function (chunk) {
        // Update the received bytes
        received_bytes += chunk.length;
        process.send({
            type: 'DOWNLOAD_MANAGER_UPDATE',
            payload: [fileName, showProgress(received_bytes, total_bytes)]
        });
    });
    req.on('end', function () {
        process.send({
            type: 'DOWNLOAD_MANAGER_END',
            payload: fileName
        });
    });
}
//# sourceMappingURL=fileSystem.js.map