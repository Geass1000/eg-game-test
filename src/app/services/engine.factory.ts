import { Injectable } from '@angular/core';

import * as Managers from '../managers';
import { Interfaces, Enums } from '../shared';

import { HexagonCoordsConverterService } from './hexagon-coords-converter.service';

@Injectable()
export class EngineFactory {

  constructor (
    // Services
    private hexagonCoordsConverterService: HexagonCoordsConverterService,
  ) {
  }

  /**
   * Creats an instance of `Hexagon` manager.
   *
   * @param  {Interfaces.HexagonCoords} coords
   * @param  {THexagonValue} [value]
   * @return {Managers.HexagonManager}
   */
  createHexagonManager <THexagonValue = any> (
    coords: Interfaces.HexagonCoords,
    value?: THexagonValue,
  ): Managers.HexagonManager<THexagonValue> {
    const hexagonManager = new Managers.HexagonManager<THexagonValue>(
      // Service
      this.hexagonCoordsConverterService,
    );
    hexagonManager.$init(coords, value);
    return hexagonManager;
  }

  /**
   * Creats an instance of `Hexagon` manager from plain hexagon object.
   *
   * @param  {Interfaces.Hexagon<THexagonValue>} hexagon
   * @return {Managers.HexagonManager<THexagonValue>}
   */
  createHexagonManagerFromHexagon <THexagonValue = any> (
    hexagon: Interfaces.Hexagon<THexagonValue>,
  ): Managers.HexagonManager<THexagonValue> {
    const hexagonManager = new Managers.HexagonManager<THexagonValue>(
      // Service
      this.hexagonCoordsConverterService,
    );
    hexagonManager.$init({
      type: Enums.HexagonCoordsType.Cube,
      x: hexagon.x,
      y: hexagon.y,
      z: hexagon.z,
    }, hexagon.value);
    return hexagonManager;
  }
}
