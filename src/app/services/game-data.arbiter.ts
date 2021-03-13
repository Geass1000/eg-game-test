import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Enums } from '../shared';

const SmallRadiusParam = Math.sqrt(3) / 2;
const DefaultRadius = 70;

@Injectable()
export class GameDataArbiter {
  public gameStatus: Enums.GameStatus;

  #cHexagonRadius: number;
  set cHexagonRadius (
    radius: number,
  ) {
    this.#cHexagonRadius = radius;
    this.#iHexagonRadius = this.#cHexagonRadius * SmallRadiusParam;

    this.#hexagonWidth = this.#cHexagonRadius * 2;
    this.#hexagonHeight = this.#iHexagonRadius * 2;

    this.sjNotif.next();
  }
  /**
   * Radius (R) of circumscribed circle.
   *
   * https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Regular_hexagon_1.svg/200px-Regular_hexagon_1.svg.png
   */
  get cHexagonRadius (
  ): number {
    return this.#cHexagonRadius;
  }

  #iHexagonRadius: number;
  /**
   * Radius (r) of inscribed circle.
   *
   * https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Regular_hexagon_1.svg/200px-Regular_hexagon_1.svg.png
   */
  get iHexagonRadius (
  ): number {
    return this.#iHexagonRadius;
  }

  #hexagonWidth: number;
  /**
   * Hexagon width.
   */
  get hexagonWidth (
  ): number {
    return this.#hexagonWidth;
  }

  #hexagonHeight: number;
  /**
   * Hexagon height.
   */
  get hexagonHeight (
  ): number {
    return this.#hexagonHeight;
  }

  private sjNotif: Subject<void> = new Subject();

  constructor () {
    this.cHexagonRadius = DefaultRadius;
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
}
