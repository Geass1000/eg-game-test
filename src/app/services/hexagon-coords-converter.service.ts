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
      col: cubeCoords.x,
      row: cubeCoords.z + (cubeCoords.x - (cubeCoords.x & 1)) / 2,
    };
    return offsetCoords;
  }

  /**
   * Converts coordinates to `Offset` coordinates.
   *
   * @param  {Enums.HexagonCoordsType} coordsType
   * @param  {Interfaces.HexagonCoords} coords
   * @return {Interfaces.HexagonCubeCoords}
   */
  convertAnyToCube (
    coordsType: Enums.HexagonCoordsType.Offset,
    coords: Interfaces.HexagonOffsetCoords,
  ): Interfaces.HexagonCubeCoords;
  convertAnyToCube (
    coordsType: Enums.HexagonCoordsType.Axial,
    coords: Interfaces.HexagonAxialCoords,
  ): Interfaces.HexagonCubeCoords;
  convertAnyToCube (
    coordsType: Enums.HexagonCoordsType.Cube,
    coords: Interfaces.HexagonCubeCoords,
  ): Interfaces.HexagonCubeCoords;
  convertAnyToCube (
    coordsType: Enums.HexagonCoordsType,
    coords: Interfaces.HexagonCoords,
  ): Interfaces.HexagonCubeCoords {
    if (_.isObject(coords) === false || _.isNil(coords) === true) {
      throw new Error(`Hexagon.convertToCube:`
        + `Coords argument must be an object.`);
    }

    switch (coordsType) {
      case Enums.HexagonCoordsType.Axial: {
        const axialCoords = coords as Interfaces.HexagonAxialCoords;
        const x = axialCoords.col;
        const z = axialCoords.row;

        return {
          x: axialCoords.col,
          y: -(x + z),
          z: axialCoords.row,
        };
      }
      case Enums.HexagonCoordsType.Offset: {
        const offsetCoords = coords as Interfaces.HexagonOffsetCoords;
        const x = offsetCoords.col;
        // & 1 = % 2 for positive and negative values
        const z = offsetCoords.row - (offsetCoords.col - (offsetCoords.col & 1)) / 2;

        return {
          x: x,
          y: -(x + z),
          z: z,
        };
      }
      case Enums.HexagonCoordsType.Cube: {
        const cubeCoords = coords as Interfaces.HexagonCubeCoords;
        return cubeCoords;
      }
    }
  }
}
