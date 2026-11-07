import {
  SeatPrice,
  seatPricesAtoms,
  selectedSeatPriceAtom,
  setSchemeColorsAtom,
  svgContainerAtom,
} from '@atoms/scheme';
import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {priceWithSymbol} from '@utils/const/locale';
import {getTextColor} from '@utils/getTextColor';
import classNames from 'classnames';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useCallback} from 'react';
import styles from './PriceChips.module.scss';

/**
 * Фильтр мест по цене. По новому макету — ряд чипов под шапкой: белый чип
 * с цветным квадратиком цены, у выбранного обводка акцентом. Раньше это
 * была колонка у правого края, залитая цветами цен, со складыванием за
 * безымянный язычок.
 */
export const PriceChips = () => {
  const svgElement = useAtomValue(svgContainerAtom);
  const seatPrices = useAtomValue(seatPricesAtoms);
  const theme = useAtomValue(themeAtom);

  const [selectedSeatPrice, setSelectedSeatPrice] = useAtom(
    selectedSeatPriceAtom,
  );
  const setSchemeColors = useSetAtom(setSchemeColorsAtom);

  const handleClick = useCallback(
    (price: SeatPrice | null) => async () => {
      setSelectedSeatPrice(price);

      if (svgElement) {
        await setSchemeColors(svgElement);
      }
    },
    [setSchemeColors, setSelectedSeatPrice, svgElement],
  );

  /** Фильтровать нечего, когда цена одна. */
  if (seatPrices.length < 2) {
    return null;
  }

  const textColor = getTextColor(theme || 'dark');
  const chipBackground = theme === 'dark' ? '#2e2e2e' : colors.white;

  const chipStyle = (isSelected: boolean) => ({
    background: chipBackground,
    color: isSelected ? colors.accent : textColor,
    borderColor: isSelected ? colors.accent : undefined,
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          onClick={handleClick(null)}
          style={chipStyle(selectedSeatPrice === null)}
          className={classNames(styles.chip, {
            [styles.selected]: selectedSeatPrice === null,
          })}>
          Все
        </div>
        {seatPrices.map(price => {
          const isSelected = selectedSeatPrice?.color === price.color;

          return (
            <div
              key={`${price.color}-${price.price}`}
              onClick={handleClick(price)}
              style={chipStyle(isSelected)}
              className={classNames(styles.chip, {
                [styles.selected]: isSelected,
              })}>
              <span className={styles.dot} style={{background: price.color}} />
              {priceWithSymbol(price.price)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
