import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isNaN from 'lodash/isNaN';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import type { LoDashStatic } from 'lodash';

const lodash = {
  isNil,
  isObject,
  isNaN,
  isEmpty,
  isFunction,
  map,
  filter,
  orderBy,
  forEach,
  concat,
} as LoDashStatic;

(window as any)._ = lodash;

declare global {
  const _: typeof lodash;
}
