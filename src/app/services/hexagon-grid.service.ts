import { Injectable } from '@angular/core';

import { Interfaces, Enums } from '../shared';

import { GameParamsArbiter } from './game-params.arbiter';

@Injectable()
export class HexagonGridService {

  constructor (
    private gameParamsArbiter: GameParamsArbiter,
  ) {
  }

  /**
   * Returns a main axis by the direction.
   * Hexagons on the main axis don't change the value of this axis.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {Enums.Axis}
   */
  getMainAxisByDirection (
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
  getPositiveAxisByDirection (
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
  getNegativeAxisByDirection (
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
}
