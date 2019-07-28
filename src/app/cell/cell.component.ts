import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<any> = new EventEmitter();
  @Input() cellNumber = 0;
  @Input() cellLevel: number;
  @Input() redStar: boolean;
  @Input() blocked = true;
  @Input() enhancement = 0;
  @Input() usedTickets = 0;
  @Input() killed = false;

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

  onReset() {
    // cell 1 cannot be unkilled
    if (this.cellNumber == 1) {
      this.enhancement = 0;
      this.usedTickets = 0;
      this.changed.emit({cellNumber: this.cellNumber});
    } else {
      this.killed = false;
      this.enhancement = 0;
      this.usedTickets = 0;
      this.reset.emit({cellNumber: this.cellNumber});
    }    
    return false;
  }

  onClick() {
    if (this.blocked) return;

    let event = 'kill';
    this.usedTickets++;
    if (!this.killed) {
      this.killed = true;
      this.changed.emit({cellNumber: this.cellNumber});
    } else if (this.enhancement < 3) {
      this.enhancement++;
      this.changed.emit({cellNumber: this.cellNumber});
    } else {
      // cell 1 will only reset to killed +0 state
      if (this.cellNumber == 1) {
        this.enhancement = 0;
        this.usedTickets = 0;
        this.changed.emit({cellNumber: this.cellNumber});
      } else {
        this.killed = false;
        this.enhancement = 0;
        this.usedTickets = 0;
        this.reset.emit({cellNumber: this.cellNumber});
      }
    }
  }
}
