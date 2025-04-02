import {Theme} from '@atoms/theme';
import {colors} from '@utils/const/colors';

export const getTextColor = (theme: Theme) =>
  theme === 'dark' ? colors.white : colors.black;
