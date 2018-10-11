import { WebviewTag } from 'electron';

declare global {
    interface Window { require: any; }
}

const { ipcRenderer } = require('electron');

console.log('SOMETHING HERE');

export function scrapeModDetails() {
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
    let modDescription;
    for (let i = 0; i < thumbGalleryChildren.length; i++) {
        modThumbs.push(thumbGalleryChildren[i].children[0].children[0].children[0].getAttribute('src'));
    }

    if (window.location.href.indexOf('?tab=description') > -1) {
        const descriptionBox = document.getElementsByClassName('tab-description')[0];
        const descriptionChildren = descriptionBox.children;
        modDescription = descriptionChildren[1].innerHTML;
    }

    // ipcRenderer.send('STORE_MOD_DETAILS', {
    //     modUpdateDate: modUpdateDate,
    //     modPublishDate: modPublishDate,
    //     authorName: authorName,
    //     authorLink: authorLink,
    //     modTitle: modTitle,
    //     modThumbs: modThumbs,
    //     modUrl: window.location.href.split('?')[0]
    // });

    console.log('STORE_MOD_DETAILS', {
        modUpdateDate: modUpdateDate,
        modPublishDate: modPublishDate,
        authorName: authorName,
        authorLink: authorLink,
        modTitle: modTitle,
        modThumbs: modThumbs,
        modUrl: window.location.href.split('?')[0]
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
    scrapeModDetails();
});

window['scrapeModDetails'] = scrapeModDetails;

// console.log('MADE IT HERE', ipcRenderer);
