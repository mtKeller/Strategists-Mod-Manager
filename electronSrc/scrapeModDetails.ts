import { WebviewTag } from 'electron';
// import $ from 'jquery';
declare global {
    interface Window {
        require: any;
        $: any;
        jQuery: any;
    }
    function $(target: any);
}

const { ipcRenderer } = require('electron');

console.log('SOMETHING HERE');

// window.addEventListener('load', ()  => {
//     window.$ = window.jQuery = require('jquery');
//     console.log('loaded');
// });

export function scrapeModDetails() {
    console.log('HIT');
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
    let modDescription = null;
    for (let i = 0; i < thumbGalleryChildren.length; i++) {
        modThumbs.push(thumbGalleryChildren[i].children[0].children[0].children[0].getAttribute('src'));
    }

    $($('ul.modtabs li a')[0]).trigger('tap');

    const intervalDesc = setInterval(() => {
        if (document.getElementsByClassName('tab-description')[0] !== undefined) {
            clearInterval(intervalDesc);
            const descriptionBox = document.getElementsByClassName('tab-description')[0];
            const descriptionChildren = descriptionBox.children;
            modDescription = descriptionChildren[2].innerHTML.split('"').join().trim();
            console.log('TESTING', modDescription);
            ipcRenderer.send('STORE_MOD_DETAILS', {
                modUpdateDate: modUpdateDate,
                modPublishDate: modPublishDate,
                authorName: authorName,
                authorLink: authorLink,
                modTitle: modTitle,
                modThumbs: modThumbs,
                modUrl: window.location.href.split('?')[0],
                modDescription: modDescription
            });
            console.log('STORE_MOD_DETAILS', {
                modUpdateDate: modUpdateDate,
                modPublishDate: modPublishDate,
                authorName: authorName,
                authorLink: authorLink,
                modTitle: modTitle,
                modThumbs: modThumbs,
                modUrl: window.location.href.split('?')[0],
                modDescription: modDescription
            });
        } else {
            console.log('Does not exist');
        }
    }, 400);
}

ipcRenderer.on('SCRAPE_MOD_DETAILS', (event, args) => {
    console.log('SCRAPE THOSE DETAILS');
    scrapeModDetails();
});

document['scrapeModDetails'] = scrapeModDetails;

