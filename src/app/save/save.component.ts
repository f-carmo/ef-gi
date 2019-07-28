import { Component, OnInit, QueryList, Output, EventEmitter } from '@angular/core';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  @Output() resetMap = new EventEmitter();
  @Output() restoreMap = new EventEmitter();
  map: QueryList<CellComponent>;

  constructor() { }

  ngOnInit() {
  }

  saveMap() {
    let cellData = [];
    this.map.forEach(cell => {
      cellData.push({
        cellNumber: cell.cellNumber,
        cellLevel: cell.cellLevel,
        redStar: cell.redStar,
        blocked: cell.blocked,
        enhancement: cell.enhancement,
        killed: cell.killed,
        usedTickets: cell.usedTickets
      })
    });

    localStorage.removeItem('map');
    localStorage.setItem('map', JSON.stringify(cellData))
  }

  resetCurrentMap() {
    this.resetMap.emit('calculateScore');
  }

  clearAndReset() {
    localStorage.clear();
    this.resetMap.emit('calculateScore');
  }

  restore() {
    this.restoreMap.emit('calculateScore');
  }
}
