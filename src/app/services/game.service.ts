import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as Managers from '../managers';
import { Interfaces } from '../shared';

import { environment } from '../../environments/environment';

import { GameParamsArbiter } from './game-params.arbiter';
import { EngineFactory } from './engine.factory';

@Injectable()
export class GameService {

  constructor (
    private http: HttpClient,
    // Services
    private engineFactory: EngineFactory,
    private gameParamsArbiter: GameParamsArbiter,
  ) {
  }

  /**
   * Sends the list of non-empty hexagons and gets the list of new ones.
   *
   * @param  {Managers.HexagonManager[]} nonEmptyHexagons
   * @return {Promise<Managers.HexagonManager[]>}
   */
  async getNewHexagons (
    nonEmptyHexagons: Managers.HexagonManager[],
  ): Promise<Managers.HexagonManager[]> {
    const gameRadius = this.gameParamsArbiter.gameGridRadius;

    const preparedHexagons = _.map(nonEmptyHexagons, (nonEmptyHexagon) => {
      const plainHexagon = nonEmptyHexagon.toJSON();
      return plainHexagon;
    });

    try {
      const newHexagons = await this.http.post<Interfaces.Hexagon[]>(
        `${environment.apiUrl}/${gameRadius}`,
        preparedHexagons,
      ).toPromise();
      console.log(`GameService.getNewHexagons:`,
        `We have loaded next elements:`, newHexagons);

      const newHexagonManagers = _.map(newHexagons, (newHexagon) => {
        const newHexagonManager = this.engineFactory.createHexagonManagerFromHexagon(newHexagon);
        return newHexagonManager;
      });

      return newHexagonManagers;
    } catch (error) {
      console.error(`GameService.getNewHexagons:`,
        `We can't load a data from the server. Error:`, error);
      return [];
    }
  }

}
