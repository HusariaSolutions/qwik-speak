import { component$, Host } from '@builder.io/qwik';
import { translate as t } from '../../../library/translate';
import { formatDate as fd } from '../../../library/format-date';
import { formatNumber as fn } from '../../../library/format-number';
import { useSpeakLocale } from '../../../library/use-functions';
import { useAddSpeak } from '../../../library/use-add-speak';
import { useSpeakHead } from '../../../library/use-speak-head';

import { homeTranslation } from '../../i18n';

export const Home = component$(() => {
  useSpeakHead('home.title', 'home.description', { name: 'Qwik Speak' });

  const locale = useSpeakLocale();
  const unit = locale.units!['length'];

  return (
    <>
      {/* Params */}
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>
      {/* Html tags */}
      <p innerHTML={t('home.text')}></p>
      {/* Dates */}
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      {/* Numbers */}
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: unit })}</p>
    </>
  );
});

export default component$(() => {
  useAddSpeak([homeTranslation]); // Translation will be available in child components
  /* useAddSpeak(['/public/i18n/home']); */

  return (
    <Host>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <Home />
    </Host>
  );
});