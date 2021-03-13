import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'eg-hexagon',
  templateUrl: './hexagon.component.svg',
  styleUrls: [ './hexagon.component.scss' ],
})
export class HexagonComponent implements OnInit {

  public radius: number;
  @Input('raius')
  set inRadius (value: number) {
  }

  constructor () { }

  ngOnInit (): void {
  }

}
