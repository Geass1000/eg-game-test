import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import * as Shared from '../../shared';

import { EngineFactory } from '../../services/engine.factory';
import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';

@Component({
  selector: 'eg-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: [ './game-area.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAreaComponent extends Shared.BaseComponent implements OnInit {
  public gameAreaWidth: number;
  public gameAreaHeight: number;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    private engineFactory: EngineFactory,
    public gameAreaArbiter: GameAreaArbiter,
    public gameItemsArbiter: GameItemsArbiter,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const gameAreaArbiter$ = this.gameAreaArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.registrator.subscribe(gameAreaArbiter$);
    this.updateView();
  }

  /**
   * Recalculates:
   *  - width and height of SVG tag
   *  - view box of SVG tag
   *  - hexagon path
   *
   * @return {void}
   */
  updateView (
  ): void {
    this.gameAreaHeight = this.gameAreaArbiter.gameAreaHeight;
    this.gameAreaWidth = this.gameAreaArbiter.gameAreaWidth;
    this.render();
  }
}
