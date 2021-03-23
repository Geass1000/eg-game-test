import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

import { BaseComponent, Enums, Interfaces, Constants } from '../../shared';

// Services
import { GameArbiter } from '../../services/game.arbiter';
import { GameParamsArbiter } from '../../services/game-params.arbiter';

// State Store
import { GameStore } from '../../state-store/game.store';

@Component({
  selector: 'eg-game-metaconfig',
  templateUrl: './game-metaconfig.component.html',
  styleUrls: [ './game-metaconfig.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMetaconfigComponent extends BaseComponent implements OnInit {
  public readonly selectOptions: Interfaces.SelectOption[] = Constants.ServerOptions;
  public selectedServerURL: string = null;

  public gameStatus: Enums.GameStatus;
  public GameStatus: typeof Enums.GameStatus = Enums.GameStatus;

  constructor (
    protected changeDetection: ChangeDetectorRef,
    // Services
    private gameArbiter: GameArbiter,
    private gameParamsArbiter: GameParamsArbiter,
    // State Store
    private gameStore: GameStore,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    const gameArbiter$ = this.gameArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.registrator.subscribe(gameArbiter$);

    this.updateView();
  }

  /**
   * Updates a game status and renders view.
   *
   * @return {void}
   */
  updateView (
  ): void {
    this.gameStatus = this.gameArbiter.gameStatus;
    this.render();
  }

  /**
   * Handles changes of `Server URL` select logic.
   * Changes the server.
   *
   * @return {void}
   */
  onChangeServerURL (
  ): void {
    this.gameStore.setDataServerURL(this.selectedServerURL);
  }
}
