import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent, Interfaces } from '../../shared';

import { GameParamsArbiter } from '../../services/game-params.arbiter';
import { GameArbiter } from '../../services/game.arbiter';
import { GameItemsArbiter } from '../../services/game-items.arbiter';

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
    private gameParamsArbiter: GameParamsArbiter,
    private gameItemsArbiter: GameItemsArbiter,
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

    this.gameParamsArbiter.gameGridRadius = +event?.id;
    await this.gameItemsArbiter.$init();
    await this.gameArbiter.startGame();
  }
}
