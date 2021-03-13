import * as Enums from '../shared/enums';
import * as Interfaces from '../shared/interfaces';

export class Hexagon {
  private cubeCoords: Interfaces.HexagonCubeCoords;
  private axialCoords: Interfaces.HexagonAxialCoords;
  private offsetCoords: Interfaces.HexagonOffsetCoords;

  constructor (
    coords: Interfaces.HexagonCoords,
  ) {
    switch (coords.type) {
      case Enums.HexagonCoordsType.Axial: {
        this.axialCoords = { ...coords };
        break;
      }
      case Enums.HexagonCoordsType.Offset: {
        this.offsetCoords = { ...coords };
        break;
      }
    }

    this.cubeCoords = this.convertToCube(coords);
  }

  /**
   * Returns hexagon coordinates in `Cube` coordinates.
   *
   * @return {Interfaces.HexagonCubeCoords}
   */
  getCoordsInCube (
  ): Interfaces.HexagonCubeCoords {
    return { ...this.cubeCoords };
  }

  /**
   * Returns hexagon coordinates in `Axial` coordinates.
   *
   * @return {Interfaces.HexagonAxialCoords}
   */
  getCoordsInAxial (
  ): Interfaces.HexagonAxialCoords {
    if (_.isNil(this.axialCoords) === false) {
      return { ...this.axialCoords };
    }

    this.axialCoords = {
      type: Enums.HexagonCoordsType.Axial,
      col: this.cubeCoords.x,
      row: this.cubeCoords.z,
    };
    return { ...this.axialCoords };
  }

  /**
   * Returns hexagon coordinates in `Offset` coordinates.
   *
   * @return {Interfaces.HexagonOffsetCoords}
   */
  getCoordsInOffset (
  ): Interfaces.HexagonOffsetCoords {
    if (_.isNil(this.offsetCoords) === false) {
      return { ...this.offsetCoords };
    }

    this.offsetCoords = {
      type: Enums.HexagonCoordsType.Offset,
      col: this.cubeCoords.x,
      row: this.cubeCoords.z + (this.cubeCoords.x - (this.cubeCoords.x & 1)) / 2,
    };
    return { ...this.offsetCoords };
  }

  /**
   * Converts coordinates to `Offset` coordinates.
   *
   * @param  {Interfaces.HexagonCoords} coords
   * @return {Interfaces.HexagonCubeCoords}
   */
  private convertToCube (
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
