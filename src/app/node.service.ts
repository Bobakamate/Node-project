import { Injectable } from '@angular/core';
import { Node } from './node.data';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private nodes: Node[] = [];

  constructor() {}

  // Ajouter un nœud
  addNode(node: Node): void {
    this.nodes.push(node);
  }

  // Obtenir tous les nœuds
  getNodes(): Node[] {
    return this.nodes;
  }

  // Obtenir un nœud par ID
  getNodeById(id: number): Node | undefined {
    return this.nodes.find(node => node.id === id);
  }

  // Mettre à jour un nœud
  updateNode(updatedNode: Node): void {
    const index = this.nodes.findIndex(node => node.id === updatedNode.id);
    if (index !== -1) {
      this.nodes[index] = updatedNode;
    }
  }

  // Supprimer un nœud
  deleteNode(id: number): void {
    this.nodes = this.nodes.filter(node => node.id !== id);
  }
}
