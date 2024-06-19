// app.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Node, Data } from './node.data';
import { NodeService } from './node.service';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nodeData: Data = { nodes: [], links: [] };
  nodeCounter = 1;

  constructor(private dialog: MatDialog, private nodeService: NodeService) {}

  onMouseDown(event: MouseEvent, node: Node) {
    node.isNodeSelected = true;
    node.initialPosition = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(node: Node) {
    node.isNodeSelected = false;
  }

  onMouseMove(event: MouseEvent, node: Node) {
    if (node.isNodeSelected) {
      const deltaX = event.clientX - node.initialPosition.x;
      const deltaY = event.clientY - node.initialPosition.y;
      node.position.x += deltaX;
      node.position.y += deltaY;
      node.initialPosition = { x: event.clientX, y: event.clientY };
    }
  }

  onNodeDoubleClick(event: MouseEvent, node: Node) {
    event.preventDefault();
  }

  addNode() {
    const id = this.nodeCounter++;
    const newNode: Node = {
      id: id,
      position: { x: 0, y: 0 },
      isNodeSelected: false,
      initialPosition: { x: 0, y: 0 },
      name: 'Node ' + id,
      children: [],
      value: [],
      description: "",
      isGerereted: false,
      parameter: []
    };
    this.nodeData.nodes.push(newNode);
  }

  NodeInfo(id: number) {
    const dialogRef = this.dialog.open(HomeComponent, {
      data: { nodeData: this.nodeData, id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.nodeData = result;
      }
    });
  }

  addLink(sourceNodeId: string, targetNodeId: string) {
    const source = +sourceNodeId;
    const target = +targetNodeId;
    const newLink = [source, target];
    this.nodeData.links.push(newLink);
  }

  getNodePosition(id: number) {
    const node = this.nodeData.nodes.find(n => n.id === id);
    return node ? node.position : { x: 0, y: 0 };
  }

  getAdjustedCoordinates(sourcePos: { x: number, y: number }, targetPos: { x: number, y: number }, radius: number) {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const angle = Math.atan2(dy, dx);
    const adjustedX = targetPos.x - radius * Math.cos(angle);
    const adjustedY = targetPos.y - radius * Math.sin(angle);
    return { x: adjustedX, y: adjustedY };
  }
}
