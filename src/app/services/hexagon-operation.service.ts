import { Injectable } from '@angular/core';

import { Interfaces } from '../shared';

@Injectable()
export class HexagonOperationService {

  constructor (
  ) {
  }

  /**
   * Clones the hexagon and returns cloned one.
   *
   * @param  {Interfaces.Hexagon} hexagon
   * @return {Interfaces.Hexagon}
   */
  cloneHexagon (
    hexagon: Interfaces.Hexagon,
  ): Interfaces.Hexagon {
    return {
      x: hexagon.x,
      y: hexagon.y,
      z: hexagon.z,
      value: hexagon.value,
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
   * @param  {Interfaces.Hexagon} hexagon1
   * @param  {Interfaces.Hexagon} hexagon2
   * @return {Interfaces.Hexagon}
   */
  addCoords (
    hexagon1: Interfaces.Hexagon,
    hexagon2: Interfaces.Hexagon,
  ): Interfaces.Hexagon {
    return {
      x: hexagon1.x + hexagon2.x,
      y: hexagon1.y + hexagon2.y,
      z: hexagon1.z + hexagon2.z,
    };
  }

  /**
   * Returns `true` if we can merge Hexagon1 and Hexagon2.
   *
   * @param  {Hexagon} hexagon1
   * @param  {Hexagon} hexagon2
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
