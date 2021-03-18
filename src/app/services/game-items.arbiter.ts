import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Enums, BaseService, Interfaces } from '../shared';
import { HexagonManager } from '../managers';

import { GameParamsArbiter } from './game-params.arbiter';
import { EngineFactory } from './engine.factory';
import { GameService } from './game.service';

export interface MergeHexagonsDescriptor {
  changed: boolean;
  hexagons: HexagonManager<number>[];
}

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

    let mergeWas = false;
    const allMergedHexagons: HexagonManager<number>[] = [];
    // Merge all hexagon on every main axis value
    for (let axisValue = -gameGridSize; axisValue <= gameGridSize; axisValue++) {
      const hexagonsByDirection = _.filter(this.#hexagons, (hexagon) => {
        const hexagonCoords = hexagon.getCoordsInCube();
        return hexagonCoords[mainAxis] === axisValue;
      });

      // If there are 0 hexagons on the main axis (axisValue)
      if (hexagonsByDirection.length === 0) {
        continue;
      }

      const mergeHexagonsDescriptor = this.mergeHexagons(axisValue, hexagonsByDirection, moveDirection);

      mergeWas = mergeWas || mergeHexagonsDescriptor.changed;

      // FYI: We use a `forEach` + `push` because `concat` takes more resources
      _.forEach(mergeHexagonsDescriptor.hexagons, (mergedHexagon) => {
        allMergedHexagons.push(mergedHexagon);
      });
    }

    if (mergeWas === true) {
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
    mainAxisValue: number,
    hexagons: HexagonManager<number>[],
    moveDirection: Enums.MoveDirection,
  ): MergeHexagonsDescriptor {
    const positiveAxis = this.getPositiveAxisByDirection(moveDirection);
    const sortedHexagons = _.orderBy(hexagons, [ positiveAxis ], [ 'desc' ]);

    let maxPositiveHexagonCoords = this.getMaxPositiveHexagonCoords(mainAxisValue, moveDirection);
    const inversedMoveDirection = this.inverseDirection(moveDirection);
    const negativeDirectionOffset = this.getOffsetByDirection(inversedMoveDirection);

    let mergeWas = false;
    let i = 0;
    const mergedHexagons: HexagonManager<number>[] = [];
    // Last hexagon won't have a pair, so we won't merge it and will add it to an array as it is
    while (i < sortedHexagons.length) {
      const toHexagon = sortedHexagons[i];
      const mergeHexagon = sortedHexagons[i + 1];
      let hexagonValue: number;
      if (this.canBeMerged(toHexagon, mergeHexagon) === false) {
        // If we can't merge ToHexagon with MergeHexagon we will add ToHexagon to result array
        // and skip ToHexagon
        hexagonValue = toHexagon.value;
        // Skip ToHexagon (1)
        i++;
      } else {
        // If we can merge ToHexagon with MergeHexagon we will add MergedHexagon to result array
        // and skip ToHexagon and MergeHexagon
        hexagonValue = toHexagon.value * 2;
        // Skip ToHexagon and MergeHexagon (2)
        i += 2;
      }

      const toHexagonCoords = toHexagon.getCoordsInCube();
      // FYI[Optimization]: We can create a link-direction array to skip neighboring items which
      // weren't changed in a new iteration

      let mergedHexagon: HexagonManager<number>;
      if (toHexagon.value === hexagonValue
        && this.compareHexagonsCoords(toHexagonCoords, maxPositiveHexagonCoords) === true) {
        mergedHexagon = toHexagon;
      } else {
        mergedHexagon = this.engineFactory.createHexagonManager(maxPositiveHexagonCoords, hexagonValue);
        mergeWas = true;
      }
      mergedHexagons.push(mergedHexagon);

      // Move max positive coords to -1 position by the main axis
      maxPositiveHexagonCoords = this.addCoords(maxPositiveHexagonCoords, negativeDirectionOffset);
    }

    return {
      changed: mergeWas === true,
      hexagons: mergedHexagons,
    };
  }

  /**
   * Returns `true` if hexagons are equal.
   *
   * @param  {Interfaces.Hexagon} hexagon1
   * @param  {Interfaces.Hexagon} hexagon2
   * @return {boolean}
   */
  compareHexagons (
    hexagon1: Interfaces.Hexagon,
    hexagon2: Interfaces.Hexagon,
  ): boolean {
    return hexagon1.value === hexagon2.value
      && this.compareHexagonsCoords(hexagon1, hexagon2);
  }

  /**
   * Returns `true` if hexagons coords are equal.
   *
   * @param  {Interfaces.Hexagon} hexagon1
   * @param  {Interfaces.Hexagon} hexagon2
   * @return {boolean}
   */
  compareHexagonsCoords (
    hexagon1: Interfaces.Hexagon,
    hexagon2: Interfaces.Hexagon,
  ): boolean {
    return hexagon1.x === hexagon2.x
      && hexagon1.y === hexagon2.y
      && hexagon1.z === hexagon2.z;
  }

  /**
   * Adds `Cube` coordinates 1 to `Cube` coordinates 2 and returns a result.
   *
   * @param  {Interfaces.HexagonCubeCoords} coords1
   * @param  {Interfaces.HexagonCubeCoords} coords2
   * @return {Interfaces.HexagonCubeCoords}
   */
  addCoords (
    coords1: Interfaces.HexagonCubeCoords,
    coords2: Interfaces.HexagonCubeCoords,
  ): Interfaces.HexagonCubeCoords {
    return {
      type: Enums.HexagonCoordsType.Cube,
      x: coords1.x + coords2.x,
      y: coords1.y + coords2.y,
      z: coords1.z + coords2.z,
    };
  }

  /**
   * Returns max positive value in the main line by the direction.
   *
   * @param  {number} mainAxisValue
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Interfaces.Hexagon}
   */
  getMaxPositiveHexagonCoords (
    mainAxisValue: number,
    moveDirection: Enums.MoveDirection,
  ): Interfaces.HexagonCubeCoords {
    const gridSize = this.gameParamsArbiter.gameGridRadius - 1;
    const positiveAxisValue = mainAxisValue <= 0
      ? gridSize : gridSize - mainAxisValue;
    const negativeAxisValue = -(mainAxisValue + positiveAxisValue);

    const mainAxis = this.getMainAxisByDirection(moveDirection);
    const positiveAxis = this.getPositiveAxisByDirection(moveDirection);
    const negativeAxis = this.getNegativeAxisByDirection(moveDirection);

    // FYI: We convert value to `any` because we can't make different types for
    // main, merge and rest axes.
    return {
      type: Enums.HexagonCoordsType.Cube,
      [mainAxis]: mainAxisValue,
      [positiveAxis]: positiveAxisValue,
      [negativeAxis]: negativeAxisValue,
    } as any;
  }

  /**
   * Returns an inversion of the direction.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Enums.MoveDirection}
   */
  inverseDirection (
    moveDirection: Enums.MoveDirection,
  ): Enums.MoveDirection {
    switch (moveDirection) {
      case Enums.MoveDirection.Top:
        return Enums.MoveDirection.Bottom;
      case Enums.MoveDirection.Bottom:
        return Enums.MoveDirection.Top;
      case Enums.MoveDirection.TopRight:
        return Enums.MoveDirection.BottomLeft;
      case Enums.MoveDirection.BottomLeft:
        return Enums.MoveDirection.TopRight;
      case Enums.MoveDirection.TopLeft:
        return Enums.MoveDirection.BottomRight;
      case Enums.MoveDirection.BottomRight:
        return Enums.MoveDirection.TopLeft;
    }
  }

  /**
   * Returns a constant offset by the direction.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Interfaces.HexagonCubeCoords}
   */
  getOffsetByDirection (
    moveDirection: Enums.MoveDirection,
  ): Interfaces.HexagonCubeCoords {
    switch (moveDirection) {
      case Enums.MoveDirection.TopRight:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: +1,
          y: 0,
          z: -1,
        };
      case Enums.MoveDirection.TopLeft:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: -1,
          y: +1,
          z: 0,
        };
      case Enums.MoveDirection.Top:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: 0,
          y:  +1,
          z: -1,
        };
      case Enums.MoveDirection.BottomRight:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: +1,
          y: -1,
          z: 0,
        };
      case Enums.MoveDirection.BottomLeft:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: -1,
          y: 0,
          z: +1,
        };
      case Enums.MoveDirection.Bottom:
        return {
          type: Enums.HexagonCoordsType.Cube,
          x: 0,
          y: -1,
          z: +1,
        };
    }
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

  /**
   * Returns a negative axis by the direction.
   *
   * Hex(x, y, z)
   * Ex:
   *  - Direction: Bottom-Left
   *  - Main axis: Y
   *  - Hex(-3, +2, +1), Hex(-2, +2, 0), Hex(-1, +2, -1), Hex(0, +2, -2), Hex(+1, +2, -3)
   *  - Negative axis is a X (-3).
   *
   *  - Direction: Top-Right
   *  - Main axis: Y
   *  - Hex(-3, +2, +1), Hex(-2, +2, 0), Hex(-1, +2, -1), Hex(0, +2, -2), Hex(+1, +2, -3)
   *  - Merge axis is a Z (-3).
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Enums.Axis}
   */
  private getNegativeAxisByDirection (
    moveDirection: Enums.MoveDirection,
  ): Enums.Axis {
    switch (moveDirection) {
      case Enums.MoveDirection.Top:
        return Enums.Axis.Z;
      case Enums.MoveDirection.Bottom:
        return Enums.Axis.Y;
      case Enums.MoveDirection.TopRight:
        return Enums.Axis.Z;
      case Enums.MoveDirection.BottomLeft:
        return Enums.Axis.X;
      case Enums.MoveDirection.TopLeft:
        return Enums.Axis.X;
      case Enums.MoveDirection.BottomRight:
        return Enums.Axis.Y;
    }
  }
}
