import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectGalleryOpen, selectGalleryContent } from '../../store/ModManager/ModManager.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-gallery',
  templateUrl: './pop-gallery.component.html',
  styleUrls: ['./pop-gallery.component.scss']
})
export class PopGalleryComponent implements OnInit, OnDestroy {
  private subs: Array<Subscription>;
  galleryContent: any = null;
  galleryContentIndex = 0;
  galleryOpen = false;

  constructor(private store: Store<any>) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.pipe(
        select(selectGalleryOpen)
      ).subscribe((val) => this.galleryOpen = val),
      this.store.pipe(
        select(selectGalleryContent)
      ).subscribe(val => this.galleryContent = val)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

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
