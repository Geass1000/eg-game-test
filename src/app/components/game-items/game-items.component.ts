import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { Interfaces, Enums, BaseComponent } from '../../shared';

import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';
import { HexagonGridService } from '../../services/hexagon-grid.service';
import { HexagonOperationService } from '../../services/hexagon-operation.service';
import { GameArbiter } from '../../services/game.arbiter';

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

  /**
   * We lock all user's action until previous won't finish.
   */
  private mergeIsInProgress: boolean = false;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameArbiter: GameArbiter,
    public gameAreaArbiter: GameAreaArbiter,
    public gameItemsArbiter: GameItemsArbiter,
    public hexagonGridService: HexagonGridService,
    public hexagonOperationService: HexagonOperationService,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const gameItemsArbiter$ = this.gameItemsArbiter.getObserver()
      .subscribe(() => {
        if (this.mergeIsInProgress === true) {
          return;
        }

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
    /**
     * FYI[WORKFLOW]: We clone every hexagon to mutate their coordinates after every user's action
     * and don't change a real hexagon in an external logic (in our case it's a GameItemsArbiter).
     */
    this.hexagons = _.map(this.gameItemsArbiter.hexagons, (hexagon) => {
      return this.hexagonOperationService.cloneHexagon(hexagon);
    });
    this.render();

    const hexagonsCanBeMoved = this.gameItemsArbiter.canHexagonsBeMoved();
    if (hexagonsCanBeMoved === false) {
      this.gameArbiter.finishGame();
    }
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
    if (this.mergeIsInProgress === true) {
      return;
    }

    const moveDirection = this.getDirectionByKeyCode(event.code);
    if (_.isNil(moveDirection) === true) {
      return;
    }
    this.mergeIsInProgress = true;

    const mergeDescriptor = await this.gameItemsArbiter.mergeAllHexagons(moveDirection);

    const hexagonValueActions: Interfaces.HexagonAction[] = [];
    // FYI[WORKFLOW]: We mutate hexagon's coords to show `move` animation.
    // After animation we update view with a real values to show updated numbers.
    _.map(mergeDescriptor.actions, (action) => {
      const hexagon = _.find(this.hexagons, {
        x: action.from.x,
        y: action.from.y,
        z: action.from.z,
      });

      hexagon.x = action.to.x;
      hexagon.y = action.to.y;
      hexagon.z = action.to.z;

      hexagonValueActions.push({
        from: hexagon,
        to: action.to,
      });
    });

    this.render();

    // FYI[WORKFLOW]: We call update of values a little before the end of animation
    // to make a transition smoother.
    setTimeout(() => {
      _.forEach(hexagonValueActions, (hexagonValueAction) => {
        hexagonValueAction.from.value = hexagonValueAction.to.value;
      });
      this.render();
    }, 180);

    setTimeout(() => {
      this.mergeIsInProgress = false;
      this.updateView();
    }, 200);
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
