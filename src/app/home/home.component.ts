// home.component.ts
import { Component, ViewChildren, QueryList, ElementRef, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../Data/data.service';
import { Data, Parameter, InjectionLineParameter, injectionsLine } from '../Data/DataModel';
import { BehaviorSubject } from 'rxjs';
import { Node, ValueData } from '../node.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeInfoDialogComponent } from '../node-info-dialog/node-info-dialog.component';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  nodes: Node[];
  links: number[][];
  node: Node;
  id: number;
  sharedDataParam: Parameter[];
  @ViewChildren('paramInput') paramInputs: QueryList<ElementRef>;
  @ViewChild('descriptionInput') descriptionInput: ElementRef;
  @ViewChild('nodename') nodename: ElementRef;
  @ViewChildren('node1') nodeElements!: QueryList<ElementRef>;

  sharedData: Data;
  sharedDataParamSubject: BehaviorSubject<Parameter[]>;
  generatedLines: InjectionLineParameter[] = [];
  children: Node[] = [];

  constructor(
    private router: Router, 
    private dataService: DataService,
    public dialogRef: MatDialogRef<NodeInfoDialogComponent>,
    private nodeService: NodeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nodes = data.nodeData.nodes || [];
    this.links = data.nodeData.links || [];
    this.id = data.id;
    this.children = this.nodes.filter(node => node.id !== this.id);

    console.log("les nodes :::::::::", this.nodes);
    this.node = this.nodes.find(node => node.id === this.id);
    this.sharedData = dataService.getSharedData();
    this.sharedDataParam = this.node.parameter;
    this.sharedDataParamSubject = new BehaviorSubject<Parameter[]>(this.node.parameter);
  }

  Deletes(id: number): void {
    this.sharedDataParam = this.removeParameter(id);
    this.sharedDataParamSubject.next(this.sharedDataParam);
  }

  removeParameter(parameterId: number): Parameter[] {
    return this.node.parameter.filter(param => param.id !== parameterId);
  }

  addParametre(): void {
    const parameter: Parameter = {
      id: this.dataService.maxIndex() + 1,
      parametreName: "",
      valeurs: []
    };
    this.sharedDataParam.push(parameter);
  }

  next() {
    const inputValues = this.paramInputs.map(input => input.nativeElement.value);
    for (let i = 0; i < inputValues.length; i++) {
      const valeurInput = inputValues[i];
      this.sharedDataParam[i].parametreName = valeurInput;
    }
    this.sharedData.parametres = this.sharedDataParam;
    this.dataService.setSharedData(this.sharedData);
    this.sharedDataParamSubject.next(this.sharedDataParam);
    this.generatedLines = this.sharedDataParam.map(param => ({
      id: param.id,
      parametreName: param.parametreName,
      parametreId: param.id,
      value: ""
    }));
  }

  addChild(): void {
    // Ajout de la logique pour ajouter un enfant
  }

  removediv(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const parentDiv = target.closest('.input-param');
    if (parentDiv) {
      parentDiv.remove();
    }
  }

  removeChild(id: number): void {
    this.children = this.children.filter(node => node.id !== id);
  }

  SaveData() {
    this.onSave();
    this.dialogRef.close(this.data.nodeData);
  }

  save(): void {
    const description = this.descriptionInput.nativeElement.value;
    const nodename = this.nodename.nativeElement.value;

    this.node.name = nodename;
    this.node.description = description;

    for (let i = 0; i < this.generatedLines.length; i++) {
      const parametreName = (document.getElementById('parameter' + i) as HTMLSelectElement).value;
      const operator = (document.getElementById('operator' + i) as HTMLSelectElement).value;
      const value = (document.getElementById('value' + i) as HTMLInputElement).value;
      const probMin = (document.getElementById('probMin' + i) as HTMLInputElement).value;
      const probMax = (document.getElementById('probMax' + i) as HTMLInputElement).value;

      const valueData: ValueData = {
        id: i + 1,
        name: parametreName,
        quantitativeValue: [parametreName, operator, value, probMin, probMax]
      };
      this.node.isGerereted = true;
      this.node.value.push(valueData);
    }

    console.log('Updated Node:', this.node);
    this.SaveData();
  }

  onSave(): void {
    const selectedTargets: number[] = this.nodeElements.toArray().map((element: ElementRef) => +element.nativeElement.value);

    const node = this.nodes.find(node => node.id === this.id);
    if (!node) {
      console.error('Node not found');
      return;
    }

    node.children = [];

    for (let i = 0; i < selectedTargets.length; i++) {
      const childNode = this.nodes.find(node => node.id === selectedTargets[i]);
      if (childNode) {
        node.children.push(childNode);
      }
    }

    this.updateOrCreateLink(this.id, selectedTargets);

    console.log("This links:::::::::::: ", this.links);
  }

  updateOrCreateLink(source: number, targets: number[]): void {
    if (!this.links) {
      this.links = [];
    }
  
    const existingLinkIndices = this.links.reduce((indices, link, index) => {
      if (link[0] === source) {
        indices.push(index);
      }
      return indices;
    }, [] as number[]);
  
    targets = targets.map(target => target === -1 ? source : target);
  
    if (existingLinkIndices.length > 0) {
      existingLinkIndices.forEach((linkIndex, i) => {
        if (targets[i] !== undefined && !this.isLinkPresent(source, targets[i])) {
          this.links[linkIndex][1] = targets[i];
        }
      });
  
      targets.slice(existingLinkIndices.length).forEach(target => {
        if (!this.isLinkPresent(source, target)) {
          this.links.push([source, target]);
        }
      });
    } else {
      targets.forEach(target => {
        if (!this.isLinkPresent(source, target)) {
          this.links.push([source, target]);
        }
      });
    }
  
    console.log("les lien sont ici ::::::", this.links);
  }
  
  isLinkPresent(source: number, target: number): boolean {
    return this.links.some(link => (link[0] === source && link[1] === target) || (link[0] === target && link[1] === source));
  }
  
}

