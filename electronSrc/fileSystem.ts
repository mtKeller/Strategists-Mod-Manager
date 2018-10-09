import * as fs from 'mz/fs';
import * as callbackFs from 'fs';
const path = require('path');
const archiver = require('archiver');
const request = require('request');
const mkdirp = require('mkdirp');
const glob = require('glob');
const extract = require('extract-zip');
const AdmZip = require('adm-zip');
const rimraf = require('rimraf');
const { execFile } = require('child_process');

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
            saveState(payload);
            break;
        }
        case 'READ_DIR' : {
            readDir(action.payload);
            break;
        }
        case 'DELETE_FILE' : {
            deleteFile(action.payload);
            break;
        }
        case 'DELETE_DIRECTORY' : {
            deleteDirectory(action.payload);
            break;
        }
        case 'COPY_MOVE_FILE' : {
            copyMoveFile(action.payload);
            break;
        }
        case 'MAP_DIRECTORY' : {
            mapDirectory(action.payload);
            break;
        }
        case 'MAP_DIRECTORY_THEN_APPEND_PAYLOAD' : {
            mapDirectoryThenAppendPayload(action.payload);
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
        case 'VIEW_ZIPPED_CONTENTS' : {
            viewZippedContents(action.payload);
            break;
        }
        case 'VIEW_7ZIPPED_CONTENTS' : {
            view7ZippedContents(action.payload);
            break;
        }
        case 'UNZIP_FILE' : {
            unzipFile(action.payload);
            break;
        }
        case 'DOWNLOAD_FILE' : {
            downloadFile(action.payload);
            break;
        }
        case 'EXIT' : {
            process.exit();
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
            // console.log('check', parsedData, mhwDIR);
            process.send({
                type: 'FILE_READ',
                payload: [parsedData, mhwDIR]
            });
        })
        .catch(err => {
            console.log('ERROR', err);
            process.send({
                type: 'FILE_READ',
                payload: [false, false]
            });
        });
}

function makePath(payload) {
    mkdirp(payload);
    process.send({
        type: 'MADE_PATH',
        payload: true
    });
}

function writeFile(payload) {
    // console.log('WRITE FILE: ', payload);
    callbackFs.writeFile(payload[0], JSON.stringify(payload[1], null, 2), (err) => {
        // console.log('WRITING_FILE', payload);
        if (err) {
            console.log('ERROR', err);
            process.send({
                type: 'WROTE_FILE',
                payload: false
            });
        } else {
            process.send({
                type: 'WROTE_FILE',
                payload: true
            });
        }
    });
}

function saveState(payload) {
    // console.log('WRITE FILE: ', payload);
    callbackFs.writeFile(payload[0], JSON.stringify(payload[1], null, 2), (err) => {
        // console.log('WRITING_FILE', payload);
        if (err) {
            console.log('ERROR', err);
            process.send({
                type: 'SAVED_STATE',
                payload: false
            });
        } else {
            process.send({
                type: 'SAVED_STATE',
                payload: true
            });
        }
    });
}

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
    // console.log(srcpath);
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
                    process.send({
                        type: 'DIR_READ',
                        payload: [newMap, nativePcExists, modFolderExists]
                    });
                });
            });
        } else {
            process.send({
                type: 'DIR_READ',
                payload: [newMap, nativePcExists, modFolderExists]
            });
        }
    } else {
        process.send({
            type: 'DIR_READ',
            payload: [newMap, nativePcExists, modFolderExists
        ]});
    }
}

function copyFile(src, dest) {

    const readStream = fs.createReadStream(src);

    readStream.once('error', (err) => {
        console.log(err);
        process.send({ type: 'COPY_MOVED_FILE', payload: false});
    });

    readStream.once('end', () => {
        process.send({ type: 'COPY_MOVED_FILE', payload: true});
    });

    readStream.pipe(fs.createWriteStream(dest));
}

function copyMoveFile(payload) {
    fs.access(payload[1], (err) => {
        if (err) {
            console.log(payload);
            mkdirp.sync(payload[1]);
        }

        copyFile(payload[0], payload[1] + '\\' + payload[2]);
    });
}

function deleteFile(payload) {
    fs.unlink(payload, (err) => {
        if (err) {
            process.send({ type: 'DELETED_FILE', payload:  false});
        } else {
            process.send({ type: 'DELETED_FILE', payload: true });
        }
    });
}

function getDirContents(src, cb) {
    glob(src + '/**/*', cb);
}

function deleteDirectory(payload) {
    console.log('ATTEMPTING TO DELETE: ', payload);
    rimraf(payload, (err) => {
        console.log('ATTEMPTING TO DELETE CB');
        if (err) {
            process.send({
                type: 'DELETED_DIRECTORY',
                payload: err
            });
        } else {
            process.send({
                type: 'DELETED_DIRECTORY',
                payload: true
            });
        }
    });
}

function mapDirectory(payload) {
    getDirContents(payload, (er, files) => {
        process.send({
            type: 'MAPPED_DIRECTORY',
            payload: files
        });
    });
}

function mapDirectoryThenAppendPayload(payload) {
    getDirContents(payload, (er, files) => {
        process.send({
            type: 'MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD',
            payload: files
        });
    });
}


function getNativePcMap(payload) {
    getDirContents(payload + '\\nativePC\\', (er, files) => {
        process.send({
            type: 'GOT_NATIVE_PC_MAP',
            payload: files
        });
    });
}

function getModFolderMap(payload) {
    getDirContents(payload + '\\modFolder\\', (er, files) => {
        // console.log('CHECK THIS', files);
        process.send({
            type: 'GOT_MOD_FOLDER_MAP',
            payload: files
        });
    });
}

function createModDirs(payload) {
    mkdirp(payload + '\\nativePC\\', (err) => {
        mkdirp(payload + '\\modFolder\\temp\\', (error) => {
            process.send({
                type: 'CREATED_MOD_DIRS',
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
                type: 'ZIPPED_DIR',
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
            type: 'ZIPPED_DIR',
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
                type: 'ZIPPED_FILES',
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
            type: 'ZIPPED_FILES',
            payload: false
        });
        throw err;
    }
}

function viewZippedContents(payload) {
    const zip = new AdmZip(payload);
    const zippedPaths = zip.getEntries().map(item => item.entryName);
    console.log('VIEW_ZIPPED', payload, zippedPaths);
    process.send({
        type: 'VIEWED_ZIPPED_CONTENTS',
        payload: zippedPaths
    });
}

function view7ZippedContents(payload) {
    const pathTo7z = __dirname.split('dist\\')[0] + '\\7-Zip\\7z.exe';
    console.log(pathTo7z, payload);
    execFile(pathTo7z, ['l', payload], function(err, data) {
        const processDataArray = data.split('------------------- ----- ------------ ------------  ------------------------')[1]
            .split('------------------- ----- ------------ ------------  ------------------------')[0]
            .split('\n');
        const processedArray = [];
        for (let i = 0; i < processDataArray.length; i++) {
            const newItem = processDataArray[i].substring(53, processDataArray[i].length).replace('\r', '');
            if (newItem.length >= 1) {
                processedArray.push(newItem);
            }
        }
        process.send({
            type: 'VIEWED_7ZIPPED_CONTENTS',
            payload: processedArray
        });
    });
}

function unzipFile(payload) {
    const targetDir = payload[0] + '\\modFolder\\temp\\' + payload[1].split('.')[0] + '\\';
    const zip = new AdmZip(payload[0] + '\\modFolder\\' + payload[1]);
    zip.extractAllTo(targetDir, true, true);
    process.send({
        type: 'UNZIPPED_FILE',
        payload: true
    });
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
    let sentUpdate = false;
    const updateInterval = setInterval(() => {
        sentUpdate = false;
    }, 500);

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
        if (!sentUpdate) {
            sentUpdate = true;
            process.send({
                type: 'DOWNLOAD_MANAGER_UPDATE',
                payload: [fileName, showProgress(received_bytes, total_bytes)]
            });
        }
    });

    req.on('end', function() {
        clearInterval(updateInterval);
        process.send({
            type: 'DOWNLOAD_MANAGER_END',
            payload: fileName
        });
    });
}
