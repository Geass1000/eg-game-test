import { Injectable } from '@angular/core';

import { Interfaces } from '../shared';

@Injectable()
export class HexagonOperationService {

  constructor (
  ) {
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
      x: coords1.x + coords2.x,
      y: coords1.y + coords2.y,
      z: coords1.z + coords2.z,
    };
  }

  /**
   * Returns `true` if we can merge Hexagon1 and Hexagon2.
   *
   * @param  {HexagonManager<number>} hexagon1
   * @param  {HexagonManager<number>} hexagon2
   * @return {boolean}
   */
  canBeMerged (
    hexagon1: Interfaces.Hexagon,
    hexagon2: Interfaces.Hexagon,
  ): boolean {
    if (_.isNil(hexagon1) === true || _.isNil(hexagon2) === true) {
      return false;
    }

    return hexagon1.value === hexagon2.value;
  }
}
