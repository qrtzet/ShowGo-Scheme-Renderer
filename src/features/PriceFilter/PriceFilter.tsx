import {
  SeatPrice,
  seatPricesAtoms,
  selectedSeatPriceAtom,
  setSchemeColorsAtom,
  svgContainerAtom,
} from '@atoms/scheme';
import {colors} from '@utils/const/colors';
import {priceWithSymbol} from '@utils/const/locale';
import {isColorDark} from '@utils/isColorDark';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useCallback} from 'react';
import styles from './PriceFilter.module.scss';

export const PriceFilter = () => {
  const svgElement = useAtomValue(svgContainerAtom);
  const seatPrices = useAtomValue(seatPricesAtoms);

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

  return (
    <div className={styles.container}>
      <div
        onClick={handleClick(null)}
        style={{
          background: colors.accent,
          opacity: selectedSeatPrice !== null ? 0.3 : 1,
        }}
        className={styles.button}>
        Все
      </div>
      {seatPrices.map(price => (
        <div
          onClick={handleClick(price)}
          style={{
            background: price.color,
            color: isColorDark(price.color) ? colors.white : colors.black,
            opacity: selectedSeatPrice?.color === price.color ? 1 : 0.3,
          }}
          className={styles.button}>
          {priceWithSymbol(price.price)}
        </div>
      ))}
    </div>
  );
};
