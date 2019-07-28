import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  @Input() score = 0;
  @Input() stars = 0;
  @Input() redStars = 0;
  @Input() usedTickets = 0;

  constructor() { }

  ngOnInit() {
  }

}
