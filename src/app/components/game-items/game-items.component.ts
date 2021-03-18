import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { Interfaces, BaseComponent } from '../../shared';

import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';

type Hexagon = Interfaces.Hexagon<number>;

@Component({
  selector: 'eg-game-items',
  templateUrl: './game-items.component.html',
  styleUrls: [ './game-items.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameItemsComponent extends BaseComponent implements OnInit {
  /**
   * List of hexagons which we show a user as a game items.
   */
  public hexagons: Hexagon[];

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    public gameAreaArbiter: GameAreaArbiter,
    public gameItemsArbiter: GameItemsArbiter,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const gameItemsArbiter$ = this.gameItemsArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.registrator.subscribe(gameItemsArbiter$);

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
    this.hexagons = this.gameItemsArbiter.hexagons;
    this.render();
  }
}
