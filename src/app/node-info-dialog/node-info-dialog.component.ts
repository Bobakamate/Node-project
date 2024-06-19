import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Node } from "../node.data"; // Assurez-vous que le chemin d'importation est correct

@Component({
  selector: 'app-node-info-dialog',
  templateUrl: './node-info-dialog.component.html',
  styleUrls: ['./node-info-dialog.component.css']
})
export class NodeInfoDialogComponent {
  nodes: Node[];
  links: number[][] = [];
  node: Node;
  id: number;

  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('value') valueInput: ElementRef;
  @ViewChild('pourcentage') pourcentageInput: ElementRef;
  @ViewChild('classification') classificationInput: ElementRef;
  @ViewChild('node1') node1: ElementRef;
  @ViewChild('node2') node2: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NodeInfoDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nodes = data.nodes || [];
    this.links = data.links || [];
    this.id = data.id;
    console.log("les node :::::::::", this.nodes);
    this. node = this.nodes.find(node => node.id === this.id);

  }

  onCancel(): void {
    this.dialogRef.close(this.links);
  }

  onSave(): void {
    const selectedNode1 = this.node1.nativeElement.value;
    const selectedNode2 = this.node2.nativeElement.value;
    
    const target1: number = +selectedNode1;
    const target2: number = +selectedNode2;

    // Récupère les valeurs des champs de saisie
    const name = this.nameInput.nativeElement.value;
    const value = this.valueInput.nativeElement.value;
    const pourcentage = this.pourcentageInput.nativeElement.value;
    const classification = this.classificationInput.nativeElement.value;

    // Met à jour les informations du nœud correspondant
    const node = this.nodes.find(node => node.id === this.id);
    if (node) {
      node.name = name;
      node.value= value;
      
      }
    
    console.log(this.nodes);

    // Crée ou modifie les liens, en vérifiant que chaque nœud n'a pas plus de 2 relations
    this.updateOrCreateLink(this.id, target1, target2);

    // Ferme le dialogue en renvoyant les liens mis à jour
    console.log("This links:::::::::::: ", this.links);
    this.dialogRef.close(this.links);
  }

  updateOrCreateLink(source: number, target1: number, target2: number): void {
    if (!this.links) {
      this.links = [];
    }
    const node = this.nodes.find(node => node.id === this.id);

    // Trouve les index des liens existants pour le nœud source
    const existingLinkIndices = this.links.reduce((indices, link, index) => {
      if (link[0] === source) {
        indices.push(index);
      }
      return indices;
    }, [] as number[]);

    if (target1 === -1) {
      target1 = source;
    }
    if (target2 === -1) {
      target2 = source;
    }

    if (existingLinkIndices.length > 0) {
      // Si des liens existent, met à jour les cibles
      if (existingLinkIndices[0] !== undefined) {
        this.links[existingLinkIndices[0]][1] = target1;

      }
      if (existingLinkIndices[1] !== undefined) {
        this.links[existingLinkIndices[1]][1] = target2;
      } 
      node.children.push(
        this.nodes.find(node => node.id === this.id)
      )
    } else {
      // Si aucun lien n'existe, crée de nouveaux liens
      this.links.push([source, target1]);
      this.links.push([source, target2]);
    }
  }
}
