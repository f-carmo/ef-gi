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
  enhancement = 0;
  killed = false;
  get enhancedLevel() {
    return this.cellLevel + (50 * this.enhancement);
  }
  get starLevel() {
    const res = Math.floor((this.enhancedLevel - 220) / 80);
    return res > 0 ? res : 0;
  }

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    if (!this.killed) this.killed = true;
    else if (this.enhancement < 3) this.enhancement++;
    else {
      this.killed = false;
      this.enhancement = 0;
    }
  }
}
