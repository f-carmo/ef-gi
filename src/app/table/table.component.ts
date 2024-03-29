import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { TABLE_DATA } from '../data/map-info';
import { CellComponent } from '../cell/cell.component';
import { SaveComponent } from '../save/save.component';
import { CellType } from '../data/cell-type';
import { SimulateComponent } from '../simulate/simulate.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChildren(CellComponent) cells: QueryList<CellComponent>;
  @ViewChild(SaveComponent,  {static: false}) saveBtn: SaveComponent;
  @ViewChild(SimulateComponent,  {static: false}) simulateBtn: SimulateComponent;
  tableData: any[] = [];
  score: number;
  rawScore: number;
  totalStars: number;
  totalRedStars: number;
  usedTickets: number;

  constructor() { 
    
  }

  ngOnInit() {
    this.startMap();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cells.first.blocked = false;
      this.saveBtn.map = this.cells;
      this.simulateBtn.cells = this.cells;
      this.calculateScore();
    });
  }

  startMap() {
    if (localStorage.getItem('map') !== null) {
      this.restoreMap();      
    } else {
      this.resetMap();
    }
  }

  cellKilled($event) {
    if (this.usedTickets + 1 > 240) {
      alert("ticket limits exceeded");
    }

    this.changeSiblings($event.cellNumber, 'kill');
    this.calculateScore();
  }

  resetCell($event) {
    this.changeSiblings($event.cellNumber, 'reset');
    this.calculateScore();
  }

  calculateScore() {
    this.score = 0;
    this.rawScore = 0;
    this.totalStars = 0;
    this.totalRedStars = 0;
    this.usedTickets = 0;
    this.cells.forEach(cell => {
      this.usedTickets += cell.usedTickets;
      if (cell.killed && !cell.blocked) {
        this.rawScore += cell.totalScore;
        this.totalStars += cell.starLevel;
        if (cell.redStar) {
          this.totalStars += 1;
          this.totalRedStars++;
        }
      }
    });
    this.score = Math.ceil(this.rawScore * (1 + (this.totalStars/100)));
  }

  changeSiblings(cellNumber, eventType) {
    const siblings = [
      this.getRightSibling(cellNumber),
      this.getLeftSibling(cellNumber),
      this.getBottomSibling(cellNumber),
      this.getTopSibling(cellNumber)
    ];

    switch(eventType) {
      case 'reset':
        siblings.forEach(sibling => {
          if (
            sibling.cellNumber != 0 && // cell outside the map
            sibling.cellNumber != 1 && // cell 1 must never be blocked
            !this.hasKilledSiblings(sibling.cellNumber)) {
            sibling.blocked = true;
          }
        });
        break;

      case 'kill':
        siblings.forEach(sibling => {
          sibling.blocked = false;
        });
    }
  }

  hasKilledSiblings(cellNumber) {
    return this.getRightSibling(cellNumber).killed ||
      this.getLeftSibling(cellNumber).killed ||
      this.getBottomSibling(cellNumber).killed ||
      this.getTopSibling(cellNumber).killed;
  }

  getRightSibling(cellNumber) {
    if (cellNumber % 13 !== 0 && cellNumber !== 182) {
      return this.cells.filter((cell) => cell.cellNumber == (cellNumber + 1))[0];
    }
    return new CellComponent();
  }

  getLeftSibling(cellNumber) {
    if (cellNumber % 13 !== 1 && cellNumber !== 1) {
      return this.cells.filter((cell) => cell.cellNumber == (cellNumber - 1))[0];
    }
    return new CellComponent();
  }

  getBottomSibling(cellNumber) {
    if (cellNumber + 13 <= 182) {
      return this.cells.filter((cell) => cell.cellNumber == (cellNumber + 13))[0];
    }
    return new CellComponent();
  }

  getTopSibling(cellNumber) {
    if (cellNumber - 13 > 0) {
      return this.cells.filter((cell) => cell.cellNumber == (cellNumber - 13))[0];
    }
    return new CellComponent();
  }

  resetMap($event?) {
    this.tableData = [[]];
    let y = 0;
    for (let x = 0; x < TABLE_DATA.length; x++) {
      if (x % 13 === 0) y++;
      if (typeof this.tableData[y] === "undefined") this.tableData[y] = [];
      this.tableData[y].push(TABLE_DATA[x]);
    }

    if ($event == 'calculateScore'){
      setTimeout(() => {
        this.calculateScore();
      });
    } 
  }

  restoreMap($event?) {
    if (localStorage.getItem('map') == null) {
      this.resetMap('calculateScore');
    } else {
      this.tableData = [[]];
      let y = -1;
      let x = 0;
      const cachedData = JSON.parse(localStorage.getItem('map'));
      cachedData.map(cell => {
        let cellObj = new CellType();
        cellObj.cellNumber = cell.cellNumber,
        cellObj.cellLevel = cell.cellLevel,
        cellObj.redStar = cell.redStar,
        cellObj.blocked = cell.blocked,
        cellObj.enhancement = cell.enhancement,
        cellObj.killed = cell.killed,
        cellObj.usedTickets = cell.usedTickets

        if (x % 13 === 0) y++;
        if (typeof this.tableData[y] === "undefined") this.tableData[y] = [];
        this.tableData[y].push(cellObj);
        x++;
      });

      if ($event == 'calculateScore') {
        setTimeout(() => {
          this.calculateScore();
        });
      }
    }
  }

  downgradeLowestScore() {
    let filteredCells = this.cells.filter((cell) => cell.killed && cell.enhancement > 0);

    filteredCells.sort((a,b) => {return a.totalScore - b.totalScore}) 

    filteredCells[0].enhancement--;
    filteredCells[0].usedTickets--;

    this.calculateScore();    
  }
}
