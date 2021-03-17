import { OnDestroy, OnInit, Directive } from '@angular/core';
import { Registrator } from './registrator';

@Directive()
export class BaseDirective implements OnInit, OnDestroy {
  protected registrator: Registrator;

  constructor (
  ) {
    this.registrator = new Registrator();
  }

  /**
   * STUB.
   */
  ngOnInit (
  ): void {
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
