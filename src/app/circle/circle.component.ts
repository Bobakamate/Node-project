// src/app/circle/circle.component.ts
import { Component, Input } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent {
  @Input() id!: number;
  @Input() position!: { x: number, y: number };

  onDragEnd(event: CdkDragEnd) {
    const { x, y } = event.source.getFreeDragPosition();
    this.position = { x, y };
  }
}
