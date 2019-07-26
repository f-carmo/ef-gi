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

  onClick() {

  }

}
