import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent, Enums } from '../../shared';

import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';

@Component({
  selector: 'eg-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: [ './game-area.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAreaComponent extends BaseComponent implements OnInit {
  public gameAreaWidth: number;
  public gameAreaHeight: number;

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

  /**
   * Handles window Key Down event.
   *  - merges all hexagons by the direction.
   *
   * @param   {KeyboardEvent} event
   * @returns {void}
   */
  async onKeyDown (
    event: KeyboardEvent,
  ): Promise<void> {
    console.log(`---- KEY DOWN`, event);

    const moveDirection = this.getDirectionByKeyCode(event.code);
    if (_.isNil(moveDirection) === true) {
      return;
    }
    await this.gameItemsArbiter.mergeAllHexagons(moveDirection);
  }

  /**
   * Returns a direction by the key code.
   *
   * @param  {Enums.KeyCode|string} keyCode
   */
  getDirectionByKeyCode (
    keyCode: Enums.KeyCode | string,
  ): Enums.MoveDirection {
    switch (keyCode) {
      case Enums.KeyCode.KeyW:
        return Enums.MoveDirection.Top;
      case Enums.KeyCode.KeyS:
        return Enums.MoveDirection.Bottom;
      case Enums.KeyCode.KeyE:
        return Enums.MoveDirection.TopRight;
      case Enums.KeyCode.KeyA:
        return Enums.MoveDirection.BottomLeft;
      case Enums.KeyCode.KeyQ:
        return Enums.MoveDirection.TopLeft;
      case Enums.KeyCode.KeyD:
        return Enums.MoveDirection.BottomRight;
    }
  }
}
