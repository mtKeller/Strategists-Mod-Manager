import { WebviewTag } from 'electron';

declare global {
    interface Window { require: any; }
}

const { ipcRenderer } = require('electron');

// console.log('SOMETHING HERE');

export function scrapeModDetails(modUrl) {
    const pageTitle = document.getElementById('pagetitle') as HTMLElement;
    const fileInfo = document.getElementById('fileinfo') as HTMLElement;
    const pageTitleChildren = pageTitle.children;
    const fileInfoChildren = fileInfo.children;
    const thumbGalleryChildren = document.getElementsByClassName('thumb');
    const modUpdateDate = fileInfoChildren[1].children[1].children[0].innerHTML;
    const modPublishDate = fileInfoChildren[2].children[1].children[0].innerHTML;
    const authorName = fileInfoChildren[4].children[1].innerHTML;
    const authorLink = fileInfoChildren[4].children[1].getAttribute('href');
    const modTitle = pageTitleChildren[1].innerHTML;
    const modThumbs = [];

    for (let i = 0; i < thumbGalleryChildren.length; i++) {
        modThumbs.push(thumbGalleryChildren[i].children[0].children[0].children[0].getAttribute('src'));
    }

    ipcRenderer.send('STORE_MOD_DETAILS', {
        modUpdateDate: modUpdateDate,
        modPublishDate: modPublishDate,
        authorName: authorName,
        authorLink: authorLink,
        modTitle: modTitle,
        modThumbs: modThumbs,
        modUrl: modUrl
    });
    // for (let i = 0; i < fileInfoChildren.length; i++) {
    //     console.log(i + ': ' + fileInfoChildren[i]);
    // }
    // for (let i = 0; i < pageTitleChildren.length; i++) {
    //     console.log(i + ': ' + pageTitleChildren[i]);
    // }
}

ipcRenderer.on('SCRAPE_MOD_DETAILS', (event, args) => {
    console.log('SCRAPE THOSE DETAILS');
    scrapeModDetails(args);
});

window['scrapeModDetails'] = scrapeModDetails;

// console.log('MADE IT HERE', ipcRenderer);
