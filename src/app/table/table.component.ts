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

  updateScore($event) {
    this.score = 0;
    this.totalStars = 0;
    this.totalRedStars = 0;
    this.cells.forEach(cell => {
      if (cell.killed) {
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

}
