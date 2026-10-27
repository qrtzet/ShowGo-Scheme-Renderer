import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {useAtomValue} from 'jotai';
import {CircleSpinner} from 'react-spinners-kit';

import styles from './PlacePendingLoader.module.scss';

/**
 * Пока место уходит в корзину. В отличие от полноэкранного лоадера схему не
 * закрывает: гасить весь зал на каждый тап по месту — слишком.
 */
export const PlacePendingLoader = () => {
  const theme = useAtomValue(themeAtom);
  const isDark = theme === 'dark';

  return (
    <div
      className={styles.container}
      style={{backgroundColor: isDark ? '#2e2e2e' : colors.white}}>
      <CircleSpinner size={16} color={colors.green} />
      <div
        className={styles.text}
        style={{color: isDark ? colors.white : colors.black}}>
        Добавляем место...
      </div>
    </div>
  );
};
