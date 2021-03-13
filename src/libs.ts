import isNil from 'lodash/isNil';
import isNaN from 'lodash/isNaN';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import type { LoDashStatic } from 'lodash';

const lodash = {
  isNil,
  isNaN,
  isEmpty,
  isFunction,
  map,
} as LoDashStatic;

(window as any)._ = lodash;

declare global {
  const _: typeof lodash;
}
