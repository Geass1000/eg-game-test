import * as Enums from '../shared/enums';
import * as Interfaces from '../shared/interfaces';

export class Hexagon {
  private coords: Interfaces.HexagonCubeCoords;

  constructor (
    coords: Interfaces.HexagonCoords,
  ) {
    this.coords = this.convertToCube(coords);
  }

  /**
   * Returns hexagon coordinates in `Cube` coordinates.
   *
   * @return {Interfaces.HexagonCubeCoords}
   */
  getCoordsInCube (
  ): Interfaces.HexagonCubeCoords {
    return { ...this.coords };
  }

  /**
   * Returns hexagon coordinates in `Axial` coordinates.
   *
   * @return {Interfaces.HexagonAxialCoords}
   */
  getCoordsInAxial (
  ): Interfaces.HexagonAxialCoords {
    return {
      type: Enums.HexagonCoordsType.Axial,
      col: this.coords.x,
      row: this.coords.z,
    };
  }

  /**
   * Returns hexagon coordinates in `Offset` coordinates.
   *
   * @return {Interfaces.HexagonOffsetCoords}
   */
  getCoordsInOffset (
  ): Interfaces.HexagonOffsetCoords {
    return {
      type: Enums.HexagonCoordsType.Offset,
      col: this.coords.x,
      row: this.coords.z + (this.coords.x - (this.coords.x & 1)) / 2,
    };
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
        return {
          ...coords,
        };
      }
    }
  }
}
