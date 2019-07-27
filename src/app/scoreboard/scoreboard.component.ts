import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  @Input() score: any;
  @Input() stars: any;
  @Input() redStars: any;
  @Input() totalEnhancements: any;

  constructor() { }

  ngOnInit() {
  }

}
