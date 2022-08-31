import { component$, Slot, useMount$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import { useSpeakContext } from './use-functions';
import { loadTranslation, addData } from './core';
import { speakDev } from './utils';

export interface SpeakProps {
  /**
   * Assets to load
   */
  assets: string[];
  /**
   * Optional additional languages to preload data for
   */
  langs?: string[];
}

/**
 * Add translation data to a Speak context
 */
export const Speak = component$((props: SpeakProps) => {
  const ctx = useSpeakContext();
  const { locale, translation, config } = ctx;

  // Get location data
  const location = useLocation();

  // Will block the rendering until callback resolves
  useMount$(async () => {
    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(locale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const loadedTranslation = await loadTranslation(lang, ctx, location, props.assets);
      addData(loadedTranslation, translation[lang], lang);
      Object.assign(translation[lang], loadedTranslation[lang]);

      if (speakDev) {
        console.debug('Qwik Speak', '', `Translation loaded - ${props.assets} - ${lang}`);
      }
    }

    const resolvedAssets = new Set([...config.assets, ...props.assets]);
    Object.assign(config.assets, Array.from(resolvedAssets));
  });

  return <Slot />;
});
