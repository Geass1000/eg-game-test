import * as Enums from '../shared/enums';
import { Interfaces } from '../shared';

import { HexagonCoordsConverterService } from '../services/hexagon-coords-converter.service';

export class HexagonManager {
  private cubeCoords: Interfaces.HexagonCubeCoords;
  private axialCoords: Interfaces.HexagonAxialCoords;
  private offsetCoords: Interfaces.HexagonOffsetCoords;

  constructor (
    // Services
    private hexagonCoordsConverterService: HexagonCoordsConverterService,
  ) {
  }

  $init (
    coords: Interfaces.HexagonCoords,
  ): void {
    this.axialCoords = null;
    this.offsetCoords = null;
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

    this.cubeCoords = this.hexagonCoordsConverterService.convertAnyToCube(coords);
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

    this.axialCoords = this.hexagonCoordsConverterService.convertCubeToAxial(this.cubeCoords);
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

    this.offsetCoords = this.hexagonCoordsConverterService.convertCubeToOffset(this.cubeCoords);
    return { ...this.offsetCoords };
  }
}
