import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pop-gallery',
  templateUrl: './pop-gallery.component.html',
  styleUrls: ['./pop-gallery.component.scss']
})
export class PopGalleryComponent {
  galleryContent: any = null;
  galleryContentIndex = 0;
  galleryOpen = false;

  constructor() { }

  openGallery(content) {
    this.galleryContent = content;
    this.galleryOpen = true;
    this.galleryContentIndex = 0;
  }
  closeGallery($event) {
    $event.stopPropagation();
    this.galleryContent = null;
    this.galleryOpen = false;
  }
  incrementGallery($event) {
    $event.stopPropagation();
    if (this.galleryContentIndex + 1 !== this.galleryContent.pictures.length) {
      this.galleryContentIndex += 1;
    } else {
      this.galleryContentIndex = 0;
    }
  }
  isGalleryOpen () {
    // console.log(this.galleryOpen);
    return this.galleryOpen;
  }

}
