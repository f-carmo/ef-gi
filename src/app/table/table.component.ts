import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { TABLE_DATA } from '../data/map-info';
import { CellComponent } from '../cell/cell.component';
import { SaveComponent } from '../save/save.component';
import { CellType } from '../data/cell-type';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChildren(CellComponent) cells: QueryList<CellComponent>;
  @ViewChild(SaveComponent,  {static: false}) saveBtn: SaveComponent;
  tableData: any[] = [];
  score: number;
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

  killCell($event) {
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
    this.totalStars = 0;
    this.totalRedStars = 0;
    this.usedTickets = 0;
    this.cells.forEach(cell => {
      this.usedTickets += cell.usedTickets;
      if (cell.killed && !cell.blocked) {
        this.score += cell.totalScore;
        this.totalStars += cell.starLevel;
        if (cell.redStar) {
          this.totalStars += 1;
          this.totalRedStars++;
        }
      }
    });
    this.score = Math.ceil(this.score * (1 + (this.totalStars/100)));
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

  simulate() {
    let noMoreStars = false;
    //while (this.usedTickets < 240) {
      let filteredCells = this.cells.filter((cell) => !cell.blocked && cell.nextKillScore > 600);
      console.log('tile: ' + filteredCells[0].cellNumber, 'new stars: ' + filteredCells[0].newStarsOnKill, 'score: ' + filteredCells[0].nextKillScore)
      if (filteredCells.length > 0) filteredCells[0].onClick();
    //}
  }

  simulateHighestProjectedScore() {
    while (this.usedTickets < 240) {
      let filteredCells = this.cells.filter((cell) => !cell.blocked);

      filteredCells.map(cell => {
        let score = cell.nextKillScore;
        let totalStars = cell.newStarsOnKill;
        filteredCells.forEach(xell => {

          if (xell.killed) {
            score += xell.totalScore;
            totalStars += xell.starLevel;
            if (xell.redStar) {
              totalStars += 1;
            }
          }
        });

        cell.projectedScore = Math.ceil(score * (1 + (totalStars/100)))
      });

      filteredCells.sort((a,b) => {
        return b.projectedScore - a.projectedScore;
      });

      console.log(filteredCells[0].projectedScore, filteredCells[1].projectedScore);
      filteredCells[0].onClick();
    }
  }
}
