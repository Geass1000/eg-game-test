import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent } from '../../shared';

@Component({
  selector: 'eg-game-page',
  templateUrl: './game.page.html',
  styleUrls: [ './game.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent extends BaseComponent implements OnInit {

  constructor (
    protected changeDetection: ChangeDetectorRef,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    this.updateView();
  }

  /**
   * Renders view.
   *
   * @return {void}
   */
  updateView (
  ): void {
    this.render();
  }

}
