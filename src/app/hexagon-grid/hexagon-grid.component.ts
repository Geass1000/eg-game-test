import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import * as Shared from '../shared';

import * as Managers from '../managers';
import { EngineFactory } from '../services/engine.factory';
import { GameParamsArbiter } from '../services/game-params.arbiter';
import { GameAreaArbiter } from '../services/game-area.arbiter';

@Component({
  selector: 'eg-hexagon-grid',
  templateUrl: './hexagon-grid.component.html',
  styleUrls: [ './hexagon-grid.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonGridComponent extends Shared.BaseComponent implements OnInit {
  /**
   * List of hexagons on the grid.
   */
  public hexagons: Managers.HexagonManager[];

  /**
   * Number of hexagons in every axis.
   */
  private gridSize: number;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    private engineFactory: EngineFactory,
    public gameAreaArbiter: GameAreaArbiter,
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
        const hexagon = this.engineFactory.createHexagonManager({
          type: Shared.Enums.HexagonCoordsType.Axial,
          col: col,
          row: row,
        });

        const cubeCoords = hexagon.getCoordsInCube();

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
          hexagons.push(hexagon);
        }
      }
    }

    this.hexagons = hexagons;
  }

  /**
   * Calculates and returns an X coordinate of the hexagon by its Axial coords.
   *
   * @param  {Engine.Hexagon} hexagon
   * @return {number}
   */
  getXCoord (
    hexagon: Managers.HexagonManager,
  ): number {
    const axialCoords = hexagon.getCoordsInAxial();
    const x = this.gameParamsArbiter.cHexagonRadius * (3/2 * axialCoords.row);
    return x + this.gameAreaArbiter.gameAreaXCenter;
  }

  /**
   * Calculates and returns an Y coordinate of the hexagon by its Axial coords.
   *
   * @param  {Engine.Hexagon} hexagon
   * @return {number}
   */
  getYCoord (
    hexagon: Managers.HexagonManager,
  ): number {
    const axialCoords = hexagon.getCoordsInAxial();
    const y = this.gameParamsArbiter.cHexagonRadius * (
      Math.sqrt(3) / 2 * axialCoords.row  +  Math.sqrt(3) * axialCoords.col);
    return y + this.gameAreaArbiter.gameAreaYCenter;
  }
}
