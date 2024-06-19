import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  @HostBinding('draggable') draggable = true;

  @HostListener('dragstart', ['$event']) onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', 'Drag Me!');
  }
}
