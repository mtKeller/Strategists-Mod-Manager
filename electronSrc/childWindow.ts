import { WebviewTag, ipcRenderer } from 'electron';


const webView = document.getElementsByTagName('webview')[0];
console.log(webView, __dirname);

function replaceAll(str , search, replacement) {
    const target = str;
    return target.split(search).join(replacement);
}

webView.setAttribute('preload', replaceAll('file:\\\\' + __dirname + '\\scrapeModDetails.js', '\\', '/'));
const views = document.getElementById('views');
views.removeChild(webView);
// console.log(webView);
views.appendChild(webView);

const webViewer = document.getElementsByTagName('webview')[0] as WebviewTag;

ipcRenderer.on('SCRAPE_MOD_DETAILS', (event, args) => {
    // console.log('SCRAPE_MOD_DETAILS');
    webViewer.send('SCRAPE_MOD_DETAILS', args);
});

const ById = function (id) {
    return document.getElementById(id);
};
const path = require('path');
const uuid = require('uuid');

const back = ById('back'),
    forward = ById('forward'),
    refresh = ById('refresh'),
    urlBar = ById('url') as HTMLInputElement,
    dev = ById('console'),
    view: WebviewTag = ById('view') as WebviewTag;

function reloadView () {
    view.reload();
}

function backView () {
    view.goBack();
}

function forwardView () {
    view.goForward();
}

function updateURL (event) {
    if (event.keyCode === 13) {
        urlBar.blur();
        const val = urlBar.value;
        const https = val.slice(0, 8).toLowerCase();
        const http = val.slice(0, 7).toLowerCase();
        if (https === 'https://') {
            view.loadURL(val);
        } else if (http === 'http://') {
            view.loadURL(val);
        } else {
        view.loadURL('http://' + val);
        }
    }
}

function handleUrl (event) {
    if (event.target.className === 'link') {
        event.preventDefault();
        view.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        view.loadURL(event.target.parentElement.href);
    }
}

function handleDevtools () {
    if (view.isDevToolsOpened()) {
        view.closeDevTools();
    } else {
        view.openDevTools();
    }
}

function updateNav (event) {
    urlBar.value = view.src;
}

setInterval(() => {
    if (view.src !== undefined) {
        urlBar.value = 'LOADING';
    }
    urlBar.value = view.src;
}, 400);

// setInterval(detectModPage, 100);

refresh.addEventListener('click', reloadView);
back.addEventListener('click', backView);
forward.addEventListener('click', forwardView);
// urlBar.addEventListener('keydown', updateURL);
dev.addEventListener('click', handleDevtools);
// view.addEventListener('did-finish-load', updateNav);
// view.addEventListener(', onMouseDown);
