import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Input() cellNumber: number;
  @Input() cellLevel: number;
  @Input() redStar: boolean;
  enhancement = 0;
  killed = false;
  get enhancedLevel() {
    return this.cellLevel + (50 * this.enhancement);
  }
  get starLevel() {
    if (this.enhancedLevel >= 600) return 5;
    const res = Math.floor((this.enhancedLevel - 220) / 80);
    return res > 0 ? res : 0;
  }
  get totalScore() {
    let totalScore = 0;

    for (let x = 0; x <= this.enhancement; x++) {
      totalScore += this.cellLevel + (x * 50);
    }

    return totalScore;
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

    this.changed.emit({starLevel: this.starLevel, cellLevel: this.enhancedLevel, totalScore: this.totalScore});
  }
}
