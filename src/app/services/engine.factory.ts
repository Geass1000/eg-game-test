import { Injectable } from '@angular/core';

import * as Managers from '../managers';
import { Interfaces } from '../shared';

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
   * @return {Managers.HexagonManager}
   */
  createHexagonManager (
    coords: Interfaces.HexagonCoords,
  ): Managers.HexagonManager {
    const hexagonManager = new Managers.HexagonManager(
      // Service
      this.hexagonCoordsConverterService,
    );
    hexagonManager.$init(coords);
    return hexagonManager;
  }
}
