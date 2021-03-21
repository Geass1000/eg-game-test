import { Injectable } from '@angular/core';

import { Interfaces } from '../shared';

// Stores
import { StateStore } from './state-store.service';

@Injectable()
export class GameStore {
  constructor (
    private stateStore: StateStore, 
  ) {
    const initialState: Interfaces.GameStore = {
      gameStatus: null,
      dataServerURL: null,
    };

    this.stateStore.setState({
      state: [ 'game' ],
      value: initialState,
    });
  }

  /**
   * Sets a new data server url.
   *
   * @param  {string} dataServerURL
   * @return {void}
   */
  setDataServerURL (
    dataServerURL: string,
  ): void {
    this.stateStore.setState({
      state: [ 'game', 'dataServerURL' ],
      value: dataServerURL,
    });
  }
}
