import { Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { OpenGallery } from '../store/ModManager/ModManager.actions';

export function ripple($event, elem, id, rndr: Renderer2) {
    console.log(elem, id);
    const pageX = $event.clientX;
    const pageY = $event.clientY;
    // const buttonY = pageY - elem.offsetTop;
    // const buttonX = pageX - elem.offsetLeft;
    const buttonY = elem.getBoundingClientRect().top;
    const buttonX = elem.getBoundingClientRect().left;
    const eleRef = document.getElementById(id);
    // console.log(elem.getBoundingClientRect().left,
    // elem.getBoundingClientRect().top, $event.clientX, $event.clientY);
    const ripplePlay = this.renderer.createElement('div');
    rndr.addClass(ripplePlay, 'ripple-effect');
    rndr.setStyle(ripplePlay, 'height', `${40}px`);
    rndr.setStyle(ripplePlay, 'width', `${40}px`);
    rndr.setStyle(ripplePlay, 'top', `${pageY - buttonY - 20}px`);
    rndr.setStyle(ripplePlay, 'left', `${pageX - buttonX - 20}px`);
    rndr.setStyle(ripplePlay, 'background', 'cyan');
    rndr.appendChild(eleRef, ripplePlay);

    setTimeout(() => {
        // console.log(document.getElementsByClassName('ripple-effect'));
        rndr.setStyle(ripplePlay, 'background', 'none');
        rndr.removeChild(eleRef, ripplePlay);
    }, 1000);
}

export function openGallery(store: Store<any>, content: Array<string>): void {
    this.store.dispatch(new OpenGallery(content));
}
