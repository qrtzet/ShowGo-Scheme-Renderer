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
import classNames from 'classnames';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useCallback, useState} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import styles from './PriceFilter.module.scss';

export const PriceFilter = () => {
  const svgElement = useAtomValue(svgContainerAtom);
  const seatPrices = useAtomValue(seatPricesAtoms);

  const [selectedSeatPrice, setSelectedSeatPrice] = useAtom(
    selectedSeatPriceAtom,
  );
  const setSchemeColors = useSetAtom(setSchemeColorsAtom);
  const [isExpended, setIsExpended] = useState(true);

  const handleClick = useCallback(
    (price: SeatPrice | null) => async () => {
      setSelectedSeatPrice(price);

      if (svgElement) {
        await setSchemeColors(svgElement);
      }
    },
    [setSchemeColors, setSelectedSeatPrice, svgElement],
  );

  const toggle = useCallback(() => {
    setIsExpended(prev => !prev);
  }, []);

  return (
    <div
      className={classNames(styles.container, {
        [styles.closedContainer]: !isExpended,
      })}>
      <div className={styles.content}>
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
      <div onClick={toggle} className={styles.arrow}>
        {isExpended ? (
          <IoIosArrowForward size={11} color={colors['white-2']} />
        ) : (
          <IoIosArrowBack size={11} color={colors['white-2']} />
        )}
      </div>
    </div>
  );
};
