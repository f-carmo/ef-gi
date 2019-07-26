import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() cellNumber: number;
  @Input() cellLevel: number;
  @Input() redStar: boolean;
  @Input() enhancement: number = 0;
  killed = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.killed = true;
  }
}
