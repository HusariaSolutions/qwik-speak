import type { Translation } from './types';

/**
 * Set key-value pairs
 */
export function deepSet(target: Translation, keys: string[], val: string | Translation) {
  let i = 0;
  const len = keys.length;
  while (i < len) {
    const key = keys[i++];
    target[key] = target[key] && !val ?
      target[key] : (i === len) ?
        val : typeof target[key] === 'object' ?
          target[key] : {};
    target = target[key];
  }
}

/**
 * Deep merge translations in place
 */
export function deepMerge(target: Translation, source: Translation) {
  if (typeof target === 'object' && typeof source === 'object') {
    Object.keys(source).map(k => {
      target[k] = deepMerge(target[k], source[k]);
    });
    return target;
  }
  return source;
}

/**
 * Deep merge missing translations in place
 */
export function deepMergeMissing(target: Translation, source: Translation) {
  if (typeof target === 'object' && typeof source === 'object') {
    Object.keys(source).forEach((k) => {
      if (typeof source[k] === 'object') {
        if (!(k in target)) {
          Object.assign(target, { [k]: source[k] });
        } else {
          deepMergeMissing(target[k], source[k]);
        }
      } else if (!target[k] && source[k]) {
        Object.assign(target, { [k]: source[k] });
      }
    });
  }
}

export function deepClone(value: string | Translation) {
  if (typeof value === 'object') return JSON.parse(JSON.stringify(value));
  return value;
}

export function merge(target: Translation, source: Translation) {
  target = { ...target, ...source };
  return target;
}
