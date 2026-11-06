import {LEGACY_SCHEME_UI, schemeUiVersionAtom} from '@atoms/schemeUi';
import {useAtomValue} from 'jotai';

import {PriceChips} from './PriceChips';
import {PriceFilterLegacy} from './legacy';

/**
 * Какой фильтр цен показать — зависит от того, обновлено ли приложение.
 *
 * Схему мы выкладываем сразу всем, а приложение расходится через сторы
 * неделями, и рядом со схемой на экране живут нативные шапка, панель и
 * футер. У старой сборки они другие, и новый ряд чипов на них наложился
 * бы. Поэтому новую вёрстку включает само приложение: прислало своё
 * поколение — показываем чипы, молчит — остаётся прежняя колонка.
 */
export const PriceFilter = () => {
  const uiVersion = useAtomValue(schemeUiVersionAtom);

  return uiVersion > LEGACY_SCHEME_UI ? <PriceChips /> : <PriceFilterLegacy />;
};
