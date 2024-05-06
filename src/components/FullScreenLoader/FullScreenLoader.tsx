import {colors} from '@utils/const/colors';
import {CubeSpinner} from 'react-spinners-kit';
import styles from './FullScreenLoader.module.scss';

export const FullScreenLoader = () => {
  return (
    <div className={styles.container}>
      <CubeSpinner color={colors.accent} />
    </div>
  );
};
