import { Injectable } from '@angular/core';

import { Interfaces } from '../shared';

// Stores
import { StateStore } from './state-store.service';

@Injectable()
export class GameStore {
  constructor (
    // State Store
    private stateStore: StateStore,
  ) {
    const initialState: Interfaces.GameStore = {
      gridRadius: null,
      gridSize: null,
      numOfHexaognsInGrid: null,
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

  /**
   * Sets a new grid radius.
   *
   * @param  {number} gridRadius
   * @return {void}
   */
  setGridRadius (
    gridRadius: number,
  ): void {
    this.stateStore.setState({
      state: [ 'game', 'gridRadius' ],
      value: gridRadius,
    });

    const gridSize = gridRadius - 1;
    this.stateStore.setState({
      state: [ 'game', 'gridSize' ],
      value: gridRadius - 1,
    });

    let numOfHexagonsPartsPerRadius = 0;
    for (let i = 1; i <= gridSize; i++) {
      numOfHexagonsPartsPerRadius += i;
    }
    const numOfHexaognsInGrid = 1 + 6 * numOfHexagonsPartsPerRadius;
    this.stateStore.setState({
      state: [ 'game', 'numOfHexaognsInGrid' ],
      value: numOfHexaognsInGrid,
    });
  }
}
