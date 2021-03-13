import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import * as Managers from '../managers';
import { EngineFactory } from '../services/engine.factory';
import { GameParamsArbiter } from '../services/game-params.arbiter';
import * as Shared from '../shared';

@Component({
  selector: 'eg-hexagon-grid',
  templateUrl: './hexagon-grid.component.html',
  styleUrls: [ './hexagon-grid.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonGridComponent implements OnInit {
  /**
   * List of hexagons on the grid.
   */
  public hexagons: Managers.HexagonManager[];

  /**
   * Width of the area.
   */
  public areaWidth: number;
  /**
   * Height of the area.
   */
  public areaHeight: number;

  /**
   * X center coordinates in the area.
   */
  public areaXCenterCoord: number;
  /**
   * Y center coordinates in the area.
   */
  public areaYCenterCoord: number;

  /**
   * Number of hexagons in every axis.
   */
  private gridSize: number;

  constructor (
    private changeDetection: ChangeDetectorRef,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    private engineFactory: EngineFactory,
  ) {
    this.changeDetection.detach();
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
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
    this.gridSize = this.gameParamsArbiter.gameGridRadius - 1;

    this.updateListOfHexagons();
    this.updateAreaParams();

    this.changeDetection.detectChanges();
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
   * Updates:
   *  - width/height grid area params.
   *  - x/y center coordinates in the area.
   *
   * @return {void}
   */
  updateAreaParams (
  ): void {
    const hexagonStrokeWidth = this.gameParamsArbiter.hexagonStrokeWidth;

    /**
     * cHR - circumscribed hexagon radius. Horizontal radius.
     * `-` is a 0.5 of cHR
     * 4*- = 2*cHR
     * 3*- = 1.5*cHR
     * 2*- = cHR
     *
     * Game radius 1:
     * ----
     * width = 4*-
     *       = 2*cHR
     *
     * Game radius 2:
     * ---|-  -|---
     *    |----|
     * width = 3*- + 4*- + 3*-
     *       = 1.5*cHR + 2*cHR + 1.5*cHR
     *       = 3*cHR + 2*cHR
     *
     * Game radius 3:
     *    -|--|-  -|--|-
     * ----|  |----|  |----
     * width = 3*- + 2*- + 4*- + 2*- + 3*-
     *       = 2*cHR + cHR + 2*cHR + cHR + 2*cHR
     *       = 6*cHR + 2*cHR
     *
     * Game radius 4:
     * ---|-  -|--|-  -|--|-  -|---
     *    |----|  |----|  |----|
     * width = 3*- + 4*- + 2*- + 4*- + 2*- + 4*- + 3*-
     *       = 1.5*cHR + 2*cHR + cHR + 2*cHR + cHR + 2*cHR + 1.5*cHR
     *       = 9*cHR + 2*cHR
     */
    const cHexagonDiagonal = this.gameParamsArbiter.cHexagonRadius * 2;
    this.areaWidth = (1 + 1.5 * this.gridSize) * cHexagonDiagonal + hexagonStrokeWidth;

    /**
     * iHR - inscribed hexagon radius. Vertical radius.
     * `-` is a 2 of iHR
     * 1*- = 2*iHR
     *
     * Game radius 1:
     * -
     * height = 1*-
     *        = 2*iHR
     *
     * Game radius 2:
     * -|-|-
     * height = 1*- + 1*- + 1*-
     *        = 2*iHR + 2*iHR + 2*iHR
     *        = 4*iHR + 2*iHR
     *
     * Game radius 3:
     * -|-|-|-|-
     * height = 1*- + 1*- + 1*- + 1*- + 1*-
     *        = 2*iHR + 2*iHR + 2*iHR + 2*iHR + 2*iHR
     *        = 8*iHR + 2*iHR
     *
     * Game radius 4:
     * -|-|-|-|-|-|-
     * height = 1*- + 1*- + 1*- + 1*- + 1*-
     *        = 2*iHR + 2*iHR + 2*iHR + 2*iHR + 2*iHR + 2*iHR + 2*iHR
     *        = 12*iHR + 2*iHR
     */
    const iHexagonDiagonal = this.gameParamsArbiter.iHexagonRadius * 2;
    this.areaHeight = (1 + this.gridSize * 2) * iHexagonDiagonal + hexagonStrokeWidth;

    this.areaXCenterCoord = this.areaWidth / 2;
    this.areaYCenterCoord = this.areaHeight / 2;
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
    return x + this.areaXCenterCoord;
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
    return y + this.areaYCenterCoord;
  }
}
