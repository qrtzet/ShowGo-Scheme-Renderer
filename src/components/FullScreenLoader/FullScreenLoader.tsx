import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {useAtomValue} from 'jotai';
import {CubeSpinner} from 'react-spinners-kit';
import styles from './FullScreenLoader.module.scss';

export type FullScreenLoaderProps = {
  text?: string;
};

export const FullScreenLoader = ({text}: FullScreenLoaderProps) => {
  const theme = useAtomValue(themeAtom);

  return (
    <div
      className={styles.container}
      style={{backgroundColor: theme === 'dark' ? '#212121' : '#ebebeb'}}>
      <CubeSpinner color={colors.accent} />
      <div
        className={styles.text}
        style={{color: theme === 'dark' ? colors.white : colors.black}}>
        {text}
      </div>
    </div>
  );
};
