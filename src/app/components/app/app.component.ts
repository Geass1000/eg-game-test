import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../shared';

// Services
import { GameArbiter } from '../../services/game.arbiter';

// State Store
import { GameStore } from '../../state-store/game.store';

@Component({
  selector: 'eg-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    private route: ActivatedRoute,
    // Services
    private gameArbiter: GameArbiter,
    // State Store
    private gameStore: GameStore,
  ) {
    super(changeDetection);
  }

  ngOnInit (
  ): void {
    const routeURL$ = this.route.fragment.subscribe((fragment) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.onURLFragment(fragment);
    });
    this.registrator.subscribe(routeURL$);

    this.render();
  }

  /**
   * Parses a url fragment. If it's a valid, fn will init a new game.
   *
   * @param  {string} fragment
   * @return {Promise<void>}
   */
  async onURLFragment (
    fragment: string,
  ): Promise<void> {
    const parsedFragment = /test(\d+)/.exec(fragment);

    if (_.isNil(parsedFragment) === true) {
      return;
    }

    const gridRadius = +parsedFragment[1];

    if (gridRadius < 2) {
      console.warn(`AppComponent`);
      return;
    }

    this.gameStore.setGridRadius(gridRadius);
    await this.gameArbiter.startGame();
  }

  /**
   * Triggers a render of UI if router outlet renders component.
   *
   * FYI[WORKAROUND]: Angular doesn't trigger component's hooks if we load them via Router.
   * We observe and `activate` output property to trigger a render manually.
   *
   * @return {void}
   */
  onRouteActivated (): void {
    this.render();
  }
}
