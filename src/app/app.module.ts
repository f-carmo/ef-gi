import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { TableComponent } from './table/table.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SaveComponent } from './save/save.component';
import { SimulateComponent } from './simulate/simulate.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    TableComponent,
    ScoreboardComponent,
    SaveComponent,
    SimulateComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
