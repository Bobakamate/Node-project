import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DraggableDirective } from './draggable.directive';
import { CircleComponent } from './circle/circle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeInfoDialogComponent } from './node-info-dialog/node-info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    DraggableDirective,
    CircleComponent,
    NodeInfoDialogComponent,
    HomeComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
