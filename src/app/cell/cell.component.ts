import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  MAXIMUM_KILLABLE_LEVEL = 750;

  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<any> = new EventEmitter();
  @Input() cellNumber = 0;
  @Input() cellLevel: number;
  @Input() redStar: boolean;
  @Input() blocked = false;
  @Input() enhancement = 0;
  @Input() usedTickets = 0;
  @Input() killed = false;
  projectedScore = 0;
  path = false;
  complete = false;

  get relativeX() {
    if (this.cellNumber % 13 == 0) return 13;
    return this.cellNumber % 13;
  }

  get relativeY() {
    return Math.ceil(this.cellNumber / 13);
  }

  get enhancedLevel() {
    return this.cellLevel + (50 * this.enhancement);
  }
  get starLevel() {
    if (this.enhancedLevel >= 600) return 5;
    if (this.enhancedLevel >= 540) return 4;
    if (this.enhancedLevel >= 460) return 3;
    if (this.enhancedLevel >= 380) return 2;
    if (this.enhancedLevel >= 300) return 1;
    return 0;
  }

  get totalScore() {
    let totalScore = 0;

    for (let x = 0; x <= this.enhancement; x++) {
      totalScore += this.cellLevel + (x * 50); 
    }

    return totalScore;
  }

  get nextKillScore() {
    if (this.enhancement < 3) {
      if (this.enhancedLevel + 50 < this.MAXIMUM_KILLABLE_LEVEL) {
        return this.enhancedLevel + 50;
      }
    }
    return 0;
  }

  get newStarsOnKill() {
    if (!this.killed) {
      if (this.redStar) return this.starLevel + 1;
      return this.starLevel;
    } else {
      if (this.enhancement == 3) return 0;
      return this.projectStarLevel(this.enhancedLevel+50) - this.starLevel;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  projectStarLevel(level) {
    if (level >= 600) return 5;
    if (level >= 540) return 4;
    if (level >= 460) return 3;
    if (level >= 380) return 2;
    if (level >= 300) return 1;
    return 0;
  }

  onReset() {
    if (!this.complete) {
      this.complete = true;
    } else {
      // cell 1 cannot be unkilled
      if (this.cellNumber == 1) {
        this.complete = false;
        this.enhancement = 0;
        this.usedTickets = 0;
        this.changed.emit({cellNumber: this.cellNumber});
      } else {
        this.complete = false;
        this.killed = false;
        this.enhancement = 0;
        this.usedTickets = 0;
        this.reset.emit({cellNumber: this.cellNumber});
      }
    }
    return false;
  }

  onClick() {
    console.log(this);
    if (this.blocked) return;

    this.path = false;
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
