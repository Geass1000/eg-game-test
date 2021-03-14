import { OnDestroy, OnInit, Component, ChangeDetectorRef } from '@angular/core';

import { Registrator } from './registrator';

@Component({
  selector: 'eg-base',
  template: '<div></div>',
})
export class BaseComponent implements OnInit, OnDestroy {
  protected registrator: Registrator;

  constructor (
    protected changeDetection: ChangeDetectorRef,
  ) {
    this.changeDetection.detach();

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

  /**
   * Invokes a render procedure in next Angular tick.
   *
   * @return {void}
   */
  render (
  ): void {
    this.changeDetection.detectChanges();
  }
}
