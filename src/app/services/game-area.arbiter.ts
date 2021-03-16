import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { GameParamsArbiter } from './game-params.arbiter';
import { HexagonManager } from '../managers';

import { BaseService } from '../shared/base.service';

@Injectable()
export class GameAreaArbiter extends BaseService {
  #gameAreaWidth: number;
  /**
   * Width of the area.
   */
  get gameAreaWidth (
  ): number {
    return this.#gameAreaWidth;
  }

  #gameAreaHeight: number;
  /**
   * Height of the area.
   */
  get gameAreaHeight (
  ): number {
    return this.#gameAreaHeight;
  }

  #gameAreaXCenter: number;
  /**
   * X center coordinates in the area.
   */
  get gameAreaXCenter (
  ): number {
    return this.#gameAreaXCenter;
  }

  #gameAreaYCenter: number;
  /**
   * Y center coordinates in the area.
   */
  get gameAreaYCenter (
  ): number {
    return this.#gameAreaYCenter;
  }

  private sjNotif: Subject<void> = new Subject();

  constructor (
    private gameParamsArbiter: GameParamsArbiter,
  ) {
    super();

    this.$init();
  }

  /**
   * Inits arbiter:
   *  - subscribes to `Game Param` arbiter to update area params.
   *  - calls first calculations.
   *
   * @return {void}
   */
  $init (
  ): void {
    const gameParamsArbiter$ = this.gameParamsArbiter.getObserver()
      .subscribe(() => {
        this.updateAreaParams();
      });
    this.registrator.subscribe(gameParamsArbiter$);

    this.updateAreaParams();
  }

  /**
   * Returns a RxJS observable which we will trigger after every update of class states.
   *
   * @return {Observable<void>}
   */
  getObserver (
  ): Observable<void> {
    return this.sjNotif.asObservable();
  }

  /**
   * Updates:
   *  - width/height grid area params.
    this.gridSize = this.gameParamsArbiter.gameGridRadius - 1;
   *  - x/y center coordinates in the area.
   *
   * @return {void}
   */
  updateAreaParams (
  ): void {
    // Number of hexagons in every axis.
    const gameGridSize = this.gameParamsArbiter.gameGridRadius - 1;

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
    this.#gameAreaWidth = (1 + 1.5 * gameGridSize) * cHexagonDiagonal + hexagonStrokeWidth;

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
    this.#gameAreaHeight = (1 + gameGridSize * 2) * iHexagonDiagonal + hexagonStrokeWidth;

    this.#gameAreaXCenter = this.gameAreaWidth / 2;
    this.#gameAreaYCenter = this.gameAreaHeight / 2;

    this.sjNotif.next();
  }

  /**
   * Calculates and returns an X Cartesian coordinate of the hexagon by its Axial coords.
   *
   * @param  {HexagonManager} hexagon
   * @return {number}
   */
  getXCoord (
    hexagon: HexagonManager,
  ): number {
    const axialCoords = hexagon.getCoordsInAxial();
    const x = this.gameParamsArbiter.cHexagonRadius * (3/2 * axialCoords.row);
    return x + this.gameAreaXCenter;
  }

  /**
   * Calculates and returns an Y Cartesian coordinate of the hexagon by its Axial coords.
   *
   * @param  {HexagonManager} hexagon
   * @return {number}
   */
  getYCoord (
    hexagon: HexagonManager,
  ): number {
    const axialCoords = hexagon.getCoordsInAxial();
    const y = this.gameParamsArbiter.cHexagonRadius * (
      Math.sqrt(3) / 2 * axialCoords.row  +  Math.sqrt(3) * axialCoords.col);
    return y + this.gameAreaYCenter;
  }
}
