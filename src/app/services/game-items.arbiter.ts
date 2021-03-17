import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Enums, BaseService } from '../shared';
import { HexagonManager } from '../managers';

import { GameParamsArbiter } from './game-params.arbiter';
import { EngineFactory } from './engine.factory';
import { GameService } from './game.service';

@Injectable()
export class GameItemsArbiter extends BaseService {
  #hexagons: HexagonManager<number>[];
  /**
   * List of hexagons.
   */
  get hexagons (
  ): HexagonManager<number>[] {
    return this.#hexagons;
  }

  private sjNotif: Subject<void> = new Subject();

  constructor (
    // Services
    private engineFactory: EngineFactory,
    private gameParamsArbiter: GameParamsArbiter,
    private gameService: GameService,
  ) {
    super();
  }

  /**
   * Inits arbiter:
   *  - subscribes to `Game Param` arbiter to update area params.
   *  - calls first calculations.
   *
   * @return {Promise<void>}
   */
  async $init (
  ): Promise<void> {
    this.#hexagons = [];
    const newHexagons = await this.gameService.getNewHexagons([]);
    this.addHexagons(newHexagons);
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
   * Adds new hexagons to an internal hexagon array.
   *
   * @param  {HexagonManager<number>[]} hexagons
   * @return {void}
   */
  addHexagons (
    hexagons: HexagonManager<number>[],
  ): void {
    this.#hexagons = _.concat(this.#hexagons, hexagons);
    this.sjNotif.next();
  }

  /**
   * Merges all hexagons.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {void}
   */
  async mergeAllHexagons (
    moveDirection: Enums.MoveDirection,
  ): Promise<void> {
    const mainAxis = this.getMainAxisByDirection(moveDirection);
    const gameGridSize = this.gameParamsArbiter.gameGridRadius - 1;

    const allMergedHexagons: HexagonManager<number>[] = [];
    // Merge all hexagon on every main axis value
    for (let axisValue = -gameGridSize; axisValue <= gameGridSize; axisValue++) {
      const hexagonsByDirection = _.filter(
        this.#hexagons,
        [ mainAxis, axisValue ],
      );

      // If there are 0 hexagons on the main axis (axisValue)
      if (hexagonsByDirection.length === 0) {
        continue;
      }

      // If there is 1 hexagon on the main axis (axisValue)
      if (hexagonsByDirection.length === 1) {
        allMergedHexagons.push(hexagonsByDirection[0]);
        continue;
      }

      const axisMergedHexagons = this.mergeHexagons(hexagonsByDirection, moveDirection);

      // FYI: We use a `forEach` + `push` because `concat` takes more resources
      _.forEach(axisMergedHexagons, (mergedHexagon) => {
        allMergedHexagons.push(mergedHexagon);
      });
    }

    if (allMergedHexagons.length !== this.#hexagons.length) {
      this.#hexagons = allMergedHexagons;
      const newHexagons = await this.gameService.getNewHexagons(this.#hexagons);
      this.addHexagons(newHexagons);
    }
  }

  /**
   * Merges hexagons by the direction.
   *
   * @param  {HexagonManager<number>[]} hexagons
   * @param  {Enums.MoveDirection} moveDirection
   * @return {HexagonManager<number>[]}
   */
  private mergeHexagons (
    hexagons: HexagonManager<number>[],
    moveDirection: Enums.MoveDirection,
  ): HexagonManager<number>[] {
    const positiveAxis = this.getPositiveAxisByDirection(moveDirection);
    const sortedHexagons = _.orderBy(hexagons, [ positiveAxis ], [ 'desc' ]);

    let i = 0;
    const mergedHexagons: HexagonManager<number>[] = [];
    // Last hexagon won't have a pair, so we won't merge it and will add it to an array as it is
    while (i < sortedHexagons.length) {
      const toHexagon = sortedHexagons[i];
      const mergeHexagon = sortedHexagons[i + 1];
      // If we can't merge ToHexagon with MergeHexagon we will add ToHexagon to result array
      // and skip ToHexagon
      if (this.canBeMerged(toHexagon, mergeHexagon) === false) {
        mergedHexagons.push(toHexagon);
        // Skip ToHexagon (1)
        i++;
        continue;
      }

      // If we can merge ToHexagon with MergeHexagon we will add MergedHexagon to result array
      // and skip ToHexagon and MergeHexagon
      const mergedHexagonCoords = toHexagon.getCoordsInCube();
      const mergedHexagon = this.engineFactory
        .createHexagonManager(mergedHexagonCoords, toHexagon.value * 2);
      mergedHexagons.push(mergedHexagon);
      // Skip ToHexagon and MergeHexagon (2)
      i += 2;
    }

    return mergedHexagons;
  }

  /**
   * Returns `true` if we can merge Hexagon1 and Hexagon2.
   *
   * @param  {HexagonManager<number>} hexagon1
   * @param  {HexagonManager<number>} hexagon2
   * @return {boolean}
   */
  private canBeMerged (
    hexagon1: HexagonManager<number>,
    hexagon2: HexagonManager<number>,
  ): boolean {
    if (_.isNil(hexagon1) === true || _.isNil(hexagon2) === true) {
      return false;
    }

    return hexagon1.value === hexagon2.value;
  }

  /**
   * Returns a main axis by the direction.
   * Hexagons on the main axis don't change the value of this axis.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Enums.Axis}
   */
  private getMainAxisByDirection (
    moveDirection: Enums.MoveDirection,
  ): Enums.Axis {
    switch (moveDirection) {
      case Enums.MoveDirection.Top:
      case Enums.MoveDirection.Bottom:
        return Enums.Axis.X;
      case Enums.MoveDirection.TopRight:
      case Enums.MoveDirection.BottomLeft:
        return Enums.Axis.Y;
      case Enums.MoveDirection.TopLeft:
      case Enums.MoveDirection.BottomRight:
        return Enums.Axis.Z;
    }
  }

  /**
   * Returns a positive axis by the direction.
   * We use it to sort hexagon array by desc to merge them.
   *
   * Hex(x, y, z)
   * Ex:
   *  - Direction: Bottom-Left
   *  - Main axis: Y
   *  - Hex(-3, +2, +1), Hex(-2, +2, 0), Hex(-1, +2, -1), Hex(0, +2, -2), Hex(+1, +2, -3)
   *  - Merge axis is a Z (+1).
   *
   *  - Direction: Top-Right
   *  - Main axis: Y
   *  - Hex(-3, +2, +1), Hex(-2, +2, 0), Hex(-1, +2, -1), Hex(0, +2, -2), Hex(+1, +2, -3)
   *  - Merge axis is a X (+1).
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Enums.Axis}
   */
  private getPositiveAxisByDirection (
    moveDirection: Enums.MoveDirection,
  ): Enums.Axis {
    switch (moveDirection) {
      case Enums.MoveDirection.Top:
        return Enums.Axis.Y;
      case Enums.MoveDirection.Bottom:
        return Enums.Axis.Z;
      case Enums.MoveDirection.TopRight:
        return Enums.Axis.X;
      case Enums.MoveDirection.BottomLeft:
        return Enums.Axis.Z;
      case Enums.MoveDirection.TopLeft:
        return Enums.Axis.Y;
      case Enums.MoveDirection.BottomRight:
        return Enums.Axis.X;
    }
  }
}
