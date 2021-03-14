import type { Subscription } from 'rxjs';

export class Registrator {
  private subscriptionsSet: Set<Subscription>;
  private managersSet: Set<any>;

  constructor (
  ) {
    this.subscriptionsSet = new Set();
    this.managersSet = new Set();
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
}
