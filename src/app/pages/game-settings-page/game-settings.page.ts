import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent, Interfaces } from '../../shared';

// Services
import { GameArbiter } from '../../services/game.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';

// State Store
import { GameStore } from '../../state-store/game.store';

@Component({
  selector: 'eg-game-settings-page',
  templateUrl: './game-settings.page.html',
  styleUrls: [ './game-settings.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSettingsPageComponent extends BaseComponent implements OnInit {

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameArbiter: GameArbiter,
    private gameItemsArbiter: GameItemsArbiter,
    // State Store
    private gameStore: GameStore,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    this.updateView();
  }

  /**
   * Renders view.
   *
   * @return {void}
   */
  updateView (
  ): void {
    this.render();
  }

  /**
   * Handles `Click` event on `Game Radius` buttons.
   * Inits a new game and starts it.
   *
   * @param  {Interfaces.ClickDelegateEvent} event
   * @return {Promise<void>}
   */
  async onClickGameAreaRadius (
    event: Interfaces.ClickDelegateEvent,
  ): Promise<void> {
    if (_.isEmpty(event?.id) === true) {
      return;
    }

    const gridRadius = +event?.id;
    this.gameStore.setGridRadius(gridRadius);
    await this.gameArbiter.startGame();
  }
}
