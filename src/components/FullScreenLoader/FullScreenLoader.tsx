import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {useAtomValue} from 'jotai';
import {CircleSpinner} from 'react-spinners-kit';
import styles from './FullScreenLoader.module.scss';
import {BarLoader} from "react-spinners";

export type FullScreenLoaderProps = {
  text?: string;
};

export const FullScreenLoader = ({text}: FullScreenLoaderProps) => {
  const theme = useAtomValue(themeAtom);

  return (
    <div
      className={styles.container}
      style={{backgroundColor: theme === 'dark' ? '#212121' : '#ebebeb'}}>
      <BarLoader color={colors.green} />
      <div
        className={styles.text}
        style={{color: theme === 'dark' ? colors.white : colors.black}}>
        {text}
      </div>
    </div>
  );
};
