import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { Interfaces, Enums, BaseComponent } from '../../shared';

import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameAreaArbiter } from '../../services/game-area.arbiter';
import { HexagonCoordsConverterService } from '../../services/hexagon-coords-converter.service';

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
   * Number of hexagons in every axis.
   */
  private gridSize: number;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    public gameAreaArbiter: GameAreaArbiter,
    public hexagonCoordsConverterService: HexagonCoordsConverterService,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const gameParamsArbiter$ = this.gameParamsArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.registrator.subscribe(gameParamsArbiter$);

    const gameAreaArbiter$ = this.gameParamsArbiter.getObserver()
      .subscribe(() => {
        this.render();
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
    const prevGridSize = this.gridSize;
    this.gridSize = this.gameParamsArbiter.gameGridRadius - 1;

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
    // FYI: We use an Axial coordinates to build 2D array of possible coordinates
    // and remove all wrong hexagons.
    for (let row = -this.gridSize; row <= this.gridSize; row++) {
      for (let col = -this.gridSize; col <= this.gridSize; col++) {
        const cubeCoords = this.hexagonCoordsConverterService.convertAnyToCube(
          Enums.HexagonCoordsType.Axial,
          {
            col: col,
            row: row,
          },
        );

        // Skip hexagons which are outside game grid radius
        if (Math.abs(cubeCoords.x) > this.gridSize
            || Math.abs(cubeCoords.y) > this.gridSize
            || Math.abs(cubeCoords.z) > this.gridSize) {
          continue;
        }

        // Skip hexagons which have wrong coordinates
        // FYI: The sum of all coordinates must be equal to 0
        const coordsSum = cubeCoords.x + cubeCoords.y + cubeCoords.z;
        if (coordsSum === 0) {
          hexagons.push(cubeCoords);
        }
      }
    }

    this.gridHexagons = hexagons;
  }
}
