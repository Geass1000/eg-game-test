import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { Interfaces, Enums, BaseComponent } from '../../shared';

// Services
import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';
import { HexagonCoordsConverterService } from '../../services/hexagon-coords-converter.service';
import { HexagonGridService } from '../../services/hexagon-grid.service';
import { HexagonOperationService } from '../../services/hexagon-operation.service';

// State Store
import { StateStore } from '../../state-store/state-store.service';

type Hexagon = Interfaces.Hexagon<number>;

@Component({
  selector: 'eg-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: [ './game-grid.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent extends BaseComponent implements OnInit {
  /**
   * List of hexagons which we use to build the grid.
   */
  public gridHexagons: Hexagon[];
  /**
   * We use this property to get a fast access to a grid hexagon by its coords.
   */
  private gridHexagonMap: Map<string, Hexagon> = new Map();

  /**
   * Number of hexagons in every axis.
   */
  private gridSize: number;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    public gameAreaArbiter: GameAreaArbiter,
    public gameItemsArbiter: GameItemsArbiter,
    public hexagonGridService: HexagonGridService,
    public hexagonOperationService: HexagonOperationService,
    public hexagonCoordsConverterService: HexagonCoordsConverterService,
    // State Store
    private stateStore: StateStore,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const ssGridSize$ = this.stateStore.select([ `game`, `gridSize` ])
      .subscribe(() => {
        this.updateView();
      });
    this.registrator.subscribe(ssGridSize$);

    const gameAreaArbiter$ = this.gameParamsArbiter.getObserver()
      .subscribe(() => {
        this.render();
      });
    this.registrator.subscribe(gameAreaArbiter$);

    const gameItemsArbiter$ = this.gameItemsArbiter.getObserver()
      .subscribe(() => {
        this.setHexagonsValues();
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
    const prevGridSize = this.gridSize;
    const gridSize = this.stateStore.getState([ `game`, `gridSize` ]);
    this.gridSize = gridSize;

    if (prevGridSize !== this.gridSize) {
      this.updateListOfHexagons();
    }

    this.render();
  }

  /**
   * Makes the list of hexagons which we will render on the grid.
   *
   * @return {void}
   */
  updateListOfHexagons (
  ): void {
    const hexagons = [];
    const inversedDirection = this.hexagonGridService.inverseDirection(Enums.MoveDirection.Bottom);
    const negativeDirectionOffset = this.hexagonGridService.getOffsetByDirection(inversedDirection);

    if (_.isNil(this.gridSize) === true) {
      return;
    }

    // FYI: We use an Cube coordinates to build grid
    for (let mainAxis = -this.gridSize; mainAxis <= this.gridSize; mainAxis++) {
      const maxPositiveHexagon = this.hexagonGridService
        .getMaxPositiveHexagonCoords(mainAxis, Enums.MoveDirection.Bottom);
      const maxNegativeHexagon = this.hexagonGridService
        .getMaxNegativeHexagonCoords(mainAxis, Enums.MoveDirection.Bottom);

      let nextHexagon = maxPositiveHexagon;
      while (true) {
        hexagons.push(nextHexagon);
        const coordsKey = this.hexagonCoordsConverterService.convertHexagonCoordsToString(nextHexagon);
        this.gridHexagonMap.set(coordsKey, nextHexagon);

        if (this.hexagonOperationService.compareHexagonsCoords(nextHexagon, maxNegativeHexagon) === true) {
          break;
        }

        nextHexagon = this.hexagonOperationService.addCoords(nextHexagon, negativeDirectionOffset);
        nextHexagon.value = 0;
      }
    }

    this.gridHexagons = hexagons;
    this.setHexagonsValues();
  }

  /**
   * Finds a coincidence of grid and game hexagons and sets a game hexagon's value to the
   * gird hexagon.
   *
   * @return {void}
   */
  setHexagonsValues (
  ): void {
    _.forEach(this.gameItemsArbiter.hexagons, (hexagon) => {
      const coordsKey = this.hexagonCoordsConverterService.convertHexagonCoordsToString(hexagon);
      const gridHexagon = this.gridHexagonMap.get(coordsKey);
      // FYI: We mutate a value of grid hexagon because we create and use it only in this component.
      gridHexagon.value = hexagon.value;
    });

    this.render();
  }
}
