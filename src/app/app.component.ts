import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameItemsArbiter } from './services/game-items.arbiter';
import { GameParamsArbiter } from './services/game-params.arbiter';

import { BaseComponent } from './shared';

@Component({
  selector: 'eg-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent extends BaseComponent implements OnInit {
  public gridRadius: number;

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    private route: ActivatedRoute,
    // Services
    private gameItemsArbiter: GameItemsArbiter,
    private gameParamsArbiter: GameParamsArbiter,
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

    const radius = +parsedFragment[1];

    if (radius < 2) {
      console.warn(`AppComponent`);
      return;
    }

    this.gridRadius = radius;
    this.gameParamsArbiter.gameGridRadius = this.gridRadius;
    await this.initGame();
  }

  /**
   * Inits a new game:
   *  - inites the game items arbiter.
   *
   * @return {Promise<void>}
   */
  async initGame (
  ): Promise<void> {
    await this.gameItemsArbiter.$init();
  }
}
