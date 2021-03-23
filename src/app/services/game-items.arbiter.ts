import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Enums, BaseService, Interfaces } from '../shared';

// Services
import { GameService } from './game.service';
import { HexagonGridService } from './hexagon-grid.service';
import { HexagonOperationService } from './hexagon-operation.service';

// State Store
import { StateStore } from '../state-store/state-store.service';
import { HexagonCoordsConverterService } from './hexagon-coords-converter.service';

type Hexagon = Interfaces.Hexagon<number>;

@Injectable()
export class GameItemsArbiter extends BaseService {
  #hexagons: Hexagon[];
  /**
   * List of hexagons.
   */
  get hexagons (
  ): Hexagon[] {
    return this.#hexagons;
  }

  #lastActions: Interfaces.HexagonAction[];
  /**
   * List of last hexagons actions.
   */
  get lastActions (
  ): Interfaces.HexagonAction[] {
    return this.#lastActions;
  }

  private sjNotif: Subject<void> = new Subject();

  constructor (
    // Services
    private gameService: GameService,
    private hexagonGridService: HexagonGridService,
    private hexagonOperationService: HexagonOperationService,
    private hexagonCoordsConverterService: HexagonCoordsConverterService,
    // State Store
    private stateStore: StateStore,
  ) {
    super();
  }

  /**
   * Inits arbiter:
   *  - subscribes to `Game Param` arbiter to update area params.
   *  - calls first calculations.
   *
   * @return {Promise<void>}
   */
  async $init (
  ): Promise<void> {
    this.#hexagons = [];
    const newHexagons = await this.gameService.getNewHexagons([]);
    this.addHexagons(newHexagons);
  }

  /**
   * Returns a RxJS observable which we will trigger after every update of class states.
   *
   * @return {Observable<void>}
   */
  getObserver (
  ): Observable<void> {
    return this.sjNotif.asObservable();
  }

  /**
   * Returns `true` if a some hexagon can be moved on the grid.
   *
   * @return {boolean}
   */
  canHexagonsBeMoved (
  ): boolean {
    const numOfHexaognsInGrid = this.stateStore.getState([ 'game', 'numOfHexaognsInGrid' ]);
    if (this.hexagons.length !== numOfHexaognsInGrid) {
      return true;
    }

    // FYI: We create a map object to get fast access to hexagon by its string representation
    // of coordinates.
    const hexagonsMap: Map<string, Hexagon> = new Map();
    _.forEach(this.hexagons, (hexagon) => {
      const coordsStr = this.hexagonCoordsConverterService.convertHexagonCoordsToString(hexagon);
      hexagonsMap.set(coordsStr, hexagon);
    });

    const allDirections = [
      Enums.MoveDirection.Bottom,
      Enums.MoveDirection.BottomLeft,
      Enums.MoveDirection.BottomRight,
      Enums.MoveDirection.Top,
      Enums.MoveDirection.TopLeft,
      Enums.MoveDirection.TopRight,
    ];

    // We iterate every hexagon and check its neighbors. If we can merge some hexaogns (move one to one),
    // this logic will return `true`.
    const someHexagonCanBeMoved = _.some(this.#hexagons, (hexagon) => {
      // Iterate every neighbor
      return _.some(allDirections, (direction) => {
        const offset = this.hexagonGridService.getOffsetByDirection(direction);
        const neighborHexagonCoords = this.hexagonOperationService.addCoords(hexagon, offset);
        const neighborHexagonCoordsStr = this.hexagonCoordsConverterService
          .convertHexagonCoordsToString(neighborHexagonCoords);

        const neighborHexagon = hexagonsMap.get(neighborHexagonCoordsStr);
        return neighborHexagon?.value === hexagon.value;
      });
    });

    return someHexagonCanBeMoved;
  }

  /**
   * Adds new hexagons to an internal hexagon array.
   *
   * @param  {HexagonManager<number>[]} hexagons
   * @return {void}
   */
  addHexagons (
    hexagons: Hexagon[],
  ): void {
    this.#hexagons = _.concat(this.#hexagons, hexagons);
    this.sjNotif.next();
  }

  /**
   * Merges all hexagons.
   *
   * @param  {Enums.MoveDirection} moveDirection
   * @return {void}
   */
  async mergeAllHexagons (
    moveDirection: Enums.MoveDirection,
  ): Promise<Interfaces.MergeHexagonsDescriptor> {
    const mainAxis = this.hexagonGridService.getMainAxisByDirection(moveDirection);
    const gridSize = this.stateStore.getState([ `game`, `gridSize` ]);

    let mergeWas = false;
    const allMergedHexagons: Hexagon[] = [];
    const allHexagonsActions: Interfaces.HexagonAction[] = [];
    // Merge all hexagon on every main axis value
    for (let axisValue = -gridSize; axisValue <= gridSize; axisValue++) {
      const hexagonsByDirection = _.filter(this.#hexagons, [ mainAxis, axisValue ]);

      // If there are 0 hexagons on the main axis (axisValue)
      if (hexagonsByDirection.length === 0) {
        continue;
      }

      const mergeHexagonsDescriptor = this.mergeHexagons(axisValue, hexagonsByDirection, moveDirection);

      mergeWas = mergeWas || mergeHexagonsDescriptor.changed;

      // FYI: We use a `forEach` + `push` because `concat` takes more resources
      _.forEach(mergeHexagonsDescriptor.hexagons, (mergedHexagon) => {
        allMergedHexagons.push(mergedHexagon);
      });
      _.forEach(mergeHexagonsDescriptor.actions, (hexagonsAction) => {
        allHexagonsActions.push(hexagonsAction);
      });
    }

    if (mergeWas === true) {
      this.#lastActions = allHexagonsActions;
      this.#hexagons = allMergedHexagons;
      const newHexagons = await this.gameService.getNewHexagons(this.#hexagons);
      this.addHexagons(newHexagons);
    }

    return {
      changed: mergeWas,
      actions: allHexagonsActions,
      hexagons: this.#hexagons,
    };
  }

  /**
   * Merges hexagons by the direction.
   *
   * @param  {HexagonManager<number>[]} hexagons
   * @param  {Enums.MoveDirection} moveDirection
   * @return {HexagonManager<number>[]}
   */
  private mergeHexagons (
    mainAxisValue: number,
    hexagons: Hexagon[],
    moveDirection: Enums.MoveDirection,
  ): Interfaces.MergeHexagonsDescriptor {
    const positiveAxis = this.hexagonGridService.getPositiveAxisByDirection(moveDirection);
    const sortedHexagons = _.orderBy(hexagons, [ positiveAxis ], [ 'desc' ]);

    let maxPositiveHexagonCoords = this.hexagonGridService.getMaxPositiveHexagonCoords(mainAxisValue, moveDirection);
    const inversedMoveDirection = this.hexagonGridService.inverseDirection(moveDirection);
    const negativeDirectionOffset = this.hexagonGridService.getOffsetByDirection(inversedMoveDirection);

    let mergeWas = false;
    let i = 0;
    const mergedHexagons: Hexagon[] = [];
    const hexagonActions: Interfaces.HexagonAction<number>[] = [];
    // Last hexagon won't have a pair, so we won't merge it and will add it to an array as it is
    while (i < sortedHexagons.length) {
      const toHexagon = sortedHexagons[i];
      const mergeHexagon = sortedHexagons[i + 1];
      let hexagonValue: number;
      let numOfSteps: number;
      if (this.hexagonOperationService.canBeMerged(toHexagon, mergeHexagon) === false) {
        // If we can't merge ToHexagon with MergeHexagon we will add ToHexagon to result array
        // and skip ToHexagon
        hexagonValue = toHexagon.value;
        // Skip ToHexagon (1)
        numOfSteps = 1;
      } else {
        // If we can merge ToHexagon with MergeHexagon we will add MergedHexagon to result array
        // and skip ToHexagon and MergeHexagon
        hexagonValue = toHexagon.value * 2;
        // Skip ToHexagon and MergeHexagon (2)
        numOfSteps = 2;
      }

      // FYI[Optimization]: We can create a link-direction array to skip neighboring items which
      // weren't changed in a new iteration
      let mergedHexagon: Hexagon;
      if (toHexagon.value === hexagonValue
        && this.hexagonOperationService.compareHexagonsCoords(toHexagon, maxPositiveHexagonCoords) === true) {
        mergedHexagon = toHexagon;
      } else {
        mergedHexagon = {
          ...maxPositiveHexagonCoords,
          value: hexagonValue,
        };

        hexagonActions.push({
          from: toHexagon,
          to: mergedHexagon,
        });
        if (numOfSteps === 2) {
          hexagonActions.push({
            from: mergeHexagon,
            to: mergedHexagon,
          });
        }
        mergeWas = true;
      }
      mergedHexagons.push(mergedHexagon);

      // Move max positive coords to -1 position by the main axis
      maxPositiveHexagonCoords = this.hexagonOperationService
        .addCoords(maxPositiveHexagonCoords, negativeDirectionOffset);

      i += numOfSteps;
    }

    return {
      changed: mergeWas === true,
      actions: hexagonActions,
      hexagons: mergedHexagons,
    };
  }

}
