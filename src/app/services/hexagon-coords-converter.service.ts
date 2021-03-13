import { Injectable } from '@angular/core';

import { Interfaces, Enums } from '../shared';

@Injectable()
export class HexagonCoordsConverterService {

  constructor () {
  }

  /**
   * Converts `Cube` coordinates to `Axial` coordinates.
   *
   * @param  {Interfaces.HexagonCubeCoords} cubeCoords
   * @return {Interfaces.HexagonAxialCoords}
   */
  convertCubeToAxial (
    cubeCoords: Interfaces.HexagonCubeCoords,
  ): Interfaces.HexagonAxialCoords {
    const axialCoords: Interfaces.HexagonAxialCoords = {
      type: Enums.HexagonCoordsType.Axial,
      col: cubeCoords.x,
      row: cubeCoords.z,
    };
    return axialCoords;
  }

  /**
   * Converts `Cube` coordinates to `Offset` coordinates.
   *
   * @param  {Interfaces.HexagonCubeCoords} cubeCoords
   * @return {Interfaces.HexagonOffsetCoords}
   */
  convertCubeToOffset (
    cubeCoords: Interfaces.HexagonCubeCoords,
  ): Interfaces.HexagonOffsetCoords {
    const offsetCoords: Interfaces.HexagonOffsetCoords = {
      type: Enums.HexagonCoordsType.Offset,
      col: cubeCoords.x,
      row: cubeCoords.z + (cubeCoords.x - (cubeCoords.x & 1)) / 2,
    };
    return offsetCoords;
  }

  /**
   * Converts coordinates to `Offset` coordinates.
   *
   * @param  {Interfaces.HexagonCoords} coords
   * @return {Interfaces.HexagonCubeCoords}
   */
  convertAnyToCube (
    coords: Interfaces.HexagonCoords,
  ): Interfaces.HexagonCubeCoords {
    if (_.isObject(coords) === false || _.isNil(coords) === true) {
      throw new Error(`Hexagon.convertToCube:`
        + `Coords argument must be an object.`);
    }

    switch (coords.type) {
      case Enums.HexagonCoordsType.Axial: {
        const x = coords.col;
        const z = coords.row;

        return {
          type: Enums.HexagonCoordsType.Cube,
          x: coords.col,
          y: -(x + z),
          z: coords.row,
        };
      }
      case Enums.HexagonCoordsType.Offset: {
        const x = coords.col;
        // & 1 = % 2 for positive and negative values
        const z = coords.row - (coords.col - (coords.col & 1)) / 2;

        return {
          type: Enums.HexagonCoordsType.Cube,
          x: x,
          y: -(x + z),
          z: z,
        };
      }
      case Enums.HexagonCoordsType.Cube: {
        return coords;
      }
    }
  }
}
