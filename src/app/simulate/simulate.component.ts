import { Component, OnInit, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.css']
})
export class SimulateComponent implements OnInit {

  @Input() cells: QueryList<any>;
  @Input() usedTickets: number;
  constructor() { }

  ngOnInit() {
  }

  simulate() {
    while (this.usedTickets < 240) {
      let filteredCells = this.cells.filter((cell) => !cell.blocked && cell.nextKillScore >= 600 && cell.nextKillScore < 650);
      if (filteredCells.length > 0) filteredCells[0].onClick();
      else {
        filteredCells = this.cells.filter((cell) => !cell.blocked && cell.nextKillScore >= 550 && cell.nextKillScore < 600 && cell.enhancement < 2);
        if (filteredCells.length > 0) filteredCells[0].onClick();
        else {
          filteredCells = this.cells.filter((cell) => !cell.blocked && cell.nextKillScore >= 500 && cell.nextKillScore < 550 && cell.enhancement < 1);
          if (filteredCells.length > 0) filteredCells[0].onClick();
          else {
            //filteredCells = this.cells.filter((cell) => !cell.blocked && cell.newStarsOnKill > 1);
            //if (filteredCells.length > 0) filteredCells[0].onClick();
            //else {
              this.killHighestProjectedScore();
            //}
          }
        }
      }

      this.usedTickets++;
    }
  }

  clearPath() {
    this.cells.forEach(cell => {
      cell.path = false;
    });
  }

  getClosestKilledCells(destination): any {
    //get closest killed cell
    const killedCells = this.cells.filter(cell => {
      return cell.killed;
    })
    
    killedCells.forEach(cell => {
      cell.distance = 0;
      if (destination.relativeX >= cell.relativeX) {
        cell.distance += destination.relativeX - cell.relativeX;
      }

      if (destination.relativeY >= cell.relativeY) {
        cell.distance += destination.relativeY - cell.relativeY;
      }

      if (destination.relativeX <= cell.relativeX) {
        cell.distance += cell.relativeX - destination.relativeX;
      }

      if (destination.relativeY <= cell.relativeY) {
        cell.distance += cell.relativeY - destination.relativeY;
      }
    });

    killedCells.sort((a,b) => { return a.distance - b.distance});

    return killedCells.slice(0, 1);
  }

  simulatePathFromDestiny() {
    let destiny;    
    destiny = this.findHighestProjectedScoreAnywhere();
    destiny.path = true;

    let siblings = [];
    this.cells.filter(cell => { return cell.path }).forEach(cell => {
      siblings.push(this.getRightSibling(cell.cellNumber));
      siblings.push(this.getLeftSibling(cell.cellNumber));
      siblings.push(this.getBottomSibling(cell.cellNumber));
      siblings.push(this.getTopSibling(cell.cellNumber));
    });

    let test = Array.from(new Set(siblings.filter(cell => { return !cell.path && cell.cellNumber > 0}).sort((a,b) => { return b.projectedScore - a.projectedScore })));

    console.log(test);

    test[0].path = true;
  }

  simulatePathFromOrigin() {
    this.clearPath();
    const destination = this.findHighestProjectedScoreAnywhere();
    // destination.blocked = false;
    const test = this.getClosestKilledCells(destination);

    test.forEach(killedCell => {
      this.cells.filter(cell => {
        return this.isBetween(cell.relativeX, killedCell.relativeX, destination.relativeX) &&
          this.isBetween(cell.relativeY, killedCell.relativeY, destination.relativeY) ||
          this.getRightSibling(killedCell.cellNumber).cellNumber == cell.cellNumber ||
          this.getLeftSibling(killedCell.cellNumber).cellNumber == cell.cellNumber ||
          this.getBottomSibling(killedCell.cellNumber).cellNumber == cell.cellNumber ||
          this.getTopSibling(killedCell.cellNumber).cellNumber == cell.cellNumber;
      }).forEach(cell => {
        cell.path = true;
      });
    });
    this.killHighestProjectedUnblockedAndPathableScore();
  }

  killHighestProjectedScore() {
    this.findHighestProjectedScore().onClick();
  }

  killHighestProjectedUnblockedAndPathableScore() {
    this.findHighestProjectedScoreUnblockedInPath().onClick();
  }

  highlightHighestProjectedScoreSibling(cellNumber) {
    let siblings = [
      this.getRightSibling(cellNumber),
      this.getLeftSibling(cellNumber),
      this.getBottomSibling(cellNumber),
      this.getTopSibling(cellNumber),
    ]
    
    siblings.filter(cell => { return !cell.path }).sort((a,b) => { return b.projectedScore - a.projectedScore });
  }

  findHighestProjectedScoreUnblockedInPath() {
    let filteredCells = this.cells.filter((cell) => !cell.blocked && cell.path && !cell.killed);
    return this.calculateProjectedScore(filteredCells)[0];
  }

  findHighestProjectedScoreAnywhere() {
    let filteredCells = this.cells.toArray();
    return this.calculateProjectedScore(filteredCells)[0];
  }

  findHighestProjectedScore() {
    let filteredCells = this.cells.filter((cell) => !cell.blocked);
    return this.calculateProjectedScore(filteredCells)[0];
  }

  calculateProjectedScore(filteredCells) {
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

    return filteredCells;
  }

  highlightPriorities() {
    this.cells.filter((cell) => !cell.killed && cell.nextKillScore >= 600 && cell.nextKillScore < 650).forEach(cell => { cell.path = true; });
    this.cells.filter((cell) => !cell.killed && cell.nextKillScore >= 550 && cell.nextKillScore < 600).forEach(cell => { cell.path = true; });
    this.cells.filter((cell) => !cell.killed && cell.nextKillScore >= 500 && cell.nextKillScore < 550).forEach(cell => { cell.path = true; });
    this.cells.filter((cell) => !cell.killed && cell.newStarsOnKill >= 2).forEach(cell => { cell.path = true; }); 
  }

  isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
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