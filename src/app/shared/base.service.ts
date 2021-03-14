import { Injectable, OnDestroy } from '@angular/core';
import { Registrator } from './registrator';

@Injectable()
export class BaseService implements OnDestroy {
  protected registrator: Registrator;

  constructor (
  ) {
    this.registrator = new Registrator();
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  ngOnDestroy (
  ): void {
    this.registrator.unsubscribeAll();
  }
}
