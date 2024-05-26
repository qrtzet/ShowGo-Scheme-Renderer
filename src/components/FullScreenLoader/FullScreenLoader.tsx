import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {useAtomValue} from 'jotai';
import {CubeSpinner} from 'react-spinners-kit';
import styles from './FullScreenLoader.module.scss';

export const FullScreenLoader = () => {
  const theme = useAtomValue(themeAtom);

  return (
    <div
      className={styles.container}
      style={{backgroundColor: theme === 'dark' ? '#212121' : '#ebebeb'}}>
      <CubeSpinner color={colors.accent} />
    </div>
  );
};
