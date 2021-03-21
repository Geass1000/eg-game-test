import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Interfaces } from '../shared';

import { GameParamsArbiter } from './game-params.arbiter';

import { StateStore } from '../state-store/state-store.service';

@Injectable()
export class GameService {

  constructor (
    private http: HttpClient,
    // Services
    private gameParamsArbiter: GameParamsArbiter,
    // State Store
    private stateStore: StateStore,
  ) {
  }

  /**
   * Sends the list of non-empty hexagons and gets the list of new ones.
   *
   * @param  {Managers.HexagonManager[]} nonEmptyHexagons
   * @return {Promise<Managers.HexagonManager[]>}
   */
  async getNewHexagons (
    nonEmptyHexagons: Interfaces.Hexagon[],
  ): Promise<Interfaces.Hexagon[]> {
    const gameRadius = this.gameParamsArbiter.gameGridRadius;

    const dataServerURL = this.stateStore.getState([ `game`, `dataServerURL` ]);

    try {
      const newHexagons = await this.http.post<Interfaces.Hexagon[]>(
        `${dataServerURL}/${gameRadius}`,
        nonEmptyHexagons,
      ).toPromise();
      console.log(`GameService.getNewHexagons:`,
        `We have loaded next elements:`, newHexagons);

      return newHexagons;
    } catch (error) {
      console.error(`GameService.getNewHexagons:`,
        `We can't load a data from the server. Error:`, error);
      return [];
    }
  }

}
