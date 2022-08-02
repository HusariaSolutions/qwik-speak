import type { Translation, SpeakState } from './types';
import { isObject } from './utils';

/**
 * Load translation data for the language
 */
export const loadTranslation = async (
  lang: string,
  ctx: SpeakState,
  assets?: Array<string | Translation>
): Promise<Translation> => {
  const { config, translateFn } = ctx;

  assets = assets ?? config.assets;
  // Get translation
  const tasks = assets.map(asset => translateFn.getTranslation$?.(lang, asset));
  const results = await Promise.all(tasks);

  const translation: Translation = {};
  results.forEach(data => {
    if (data) {
      addData(translation, data, lang)
    }
  });
  return translation;
};

export const addData = (translation: Translation, data: Translation, lang: string): void => {
  translation[lang] = translation[lang] !== undefined
    ? mergeDeep(translation[lang], data)
    : data;
};

/**
 * Merge translation data
 */
export const mergeDeep = (target: Translation, source: Translation): Translation => {
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

/**
 * Get value of the key
 */
export const getValue = (key: string, data: Translation, keySeparator = '.'): string | any => {
  if (data) {
    if (keySeparator) {
      return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) != null ? acc[cur] : null, data);
    }
    return data[key] != null ? data[key] : null;
  }
  return null;
};

/**
 * Replace params in the value
 */
export const handleParams = (value: string, params: any): string => {
  const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
    const replacer = params[parsedKey];
    return replacer !== undefined ? replacer : substring;
  });
  return replacedValue;
};