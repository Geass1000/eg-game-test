import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent } from '../../shared';

// Services
import { GameItemsArbiter } from '../../services/game-items.arbiter';

// State Store
import { StateStore } from '../../state-store/state-store.service';

@Component({
  selector: 'eg-game-page',
  templateUrl: './game.page.html',
  styleUrls: [ './game.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent extends BaseComponent implements OnInit {
  public gameIsStarted: boolean;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameItemsArbiter: GameItemsArbiter,
    // State Store
    private stateStore: StateStore,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  async ngOnInit (): Promise<void> {
    const ssDataServerURL$ = this.stateStore.select([ 'game', 'dataServerURL' ])
      .subscribe(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.updateView();
      });
    this.registrator.subscribe(ssDataServerURL$);

    await this.updateView();
    this.render();
  }

  /**
   * Updates game server and restarts game.
   *
   * @return {Promise<void>}
   */
  async updateView (
  ): Promise<void> {
    this.gameIsStarted = this.shouldStartGame() === true;
    if (this.gameIsStarted === false) {
      return;
    }

    await this.gameItemsArbiter.$init();
    this.render();
  }

  /**
   * Returns `true` if we can start a new game.
   *
   * @return {void}
   */
  shouldStartGame (
  ): boolean {
    const dataServerURL = this.stateStore.getState([ 'game', 'dataServerURL' ]);
    if (_.isEmpty(dataServerURL) === true) {
      return false;
    }

    return true;
  }
}
