import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Enums } from '../shared';

@Injectable()
export class GameArbiter {
  #gameStatus: Enums.GameStatus = Enums.GameStatus.Settings;
  set gameStatus (
    gameStatus: Enums.GameStatus,
  ) {
    this.#gameStatus = gameStatus;
    this.sjNotif.next();
  }
  /**
   */
  get gameStatus (
  ): Enums.GameStatus {
    return this.#gameStatus;
  }

  private sjNotif: Subject<void> = new Subject();

  constructor (
    private router: Router,
  ) {
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
   * Opens the game settings.
   *
   * @return {Promise<void>}
   */
  async openSettings (
  ): Promise<void> {
    this.gameStatus = Enums.GameStatus.Settings;
    await this.router.navigate([ 'settings' ]);
  }

  /**
   * Starts a new game.
   *
   * @return {Promise<void>}
   */
  async startGame (
  ): Promise<void> {
    this.gameStatus = Enums.GameStatus.Playing;
    await this.router.navigate([ 'game' ]);
  }

  /**
   * Finishes the game.
   *
   * @return {void}
   */
  finishGame (): void {
    this.gameStatus = Enums.GameStatus.GameOver;
  }
}
