import { OnDestroy, OnInit, Component, ChangeDetectorRef } from '@angular/core';

import type { Subscription } from 'rxjs';

@Component({
  selector: 'eg-base',
  template: '<div></div>',
})
export class BaseComponent implements OnInit, OnDestroy {
  private subscriptionsSet: Set<Subscription>;
  private managersSet: Set<any>;

  constructor (
    protected changeDetection: ChangeDetectorRef,
  ) {
    this.changeDetection.detach();

    this.subscriptionsSet = new Set();
    this.managersSet = new Set();
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
    this.unsubscribeAll();
  }

  /**
   * Adds a subscription to subsciption list.
   *
   * @param  {Subscription} sub
   * @return {void}
   */
  subscribe (
    sub: Subscription,
  ): void {
    this.subscriptionsSet.add(sub);
  }

  /**
   * Adds the manager to the list of managers.
   * Method `$onDestroy` of every manager will be called in `$onDestory` component's hook.
   *
   * @param  {any} manager
   * @return {void}
   */
  registerManager (
    manager: any,
  ): void {
    this.managersSet.add(manager);
  }

  /**
   * Destroys all RxJs subscriptions and managers.
   *
   * @return {void}
   */
  unsubscribeAll (
  ): void {
    this.subscriptionsSet.forEach((subscription) => {
      if (_.isFunction(subscription?.unsubscribe) === true) {
        subscription.unsubscribe();
      }
    });
    this.subscriptionsSet.clear();

    this.managersSet.forEach((manager) => {
      if (_.isFunction(manager?.$destroy) === true) {
        manager.$destroy();
      }
    });
    this.managersSet.clear();
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
