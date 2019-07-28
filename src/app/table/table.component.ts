import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { TABLE_DATA } from '../data/map-info';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChildren(CellComponent) cells: QueryList<CellComponent>;
  tableData: any[] = [];
  score: number;
  totalStars: number;
  totalRedStars: number;
  usedTickets: number;

  constructor() { 
    
  }

  ngOnInit() {
    this.tableData.push([]);
    let y = 0;
    for (let x = 0; x < TABLE_DATA.length; x++) {
      if (x % 13 === 0) y++;
      if (typeof this.tableData[y] === "undefined") this.tableData[y] = [];
      this.tableData[y].push(TABLE_DATA[x]);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cells.first.blocked = false;
    });
  }

  killCell($event) {
    if (this.usedTickets + 1 > 240 && $event.eventType !== 'reset') {
      alert("ticket limits exceeded");
    }

    this.changeSiblings($event.cellNumber, $event.eventType);

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
}
