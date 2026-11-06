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
import {isColorDark} from '@utils/isColorDark';
import classNames from 'classnames';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useCallback, useState} from 'react';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import styles from './PriceFilterLegacy.module.scss';

/**
 * Прежний фильтр цен: колонка у правого края, залитая цветами цен, со
 * складыванием за язычок.
 *
 * Оставлен как есть не из лени: схема живёт в вебвью и обновляется деплоем
 * сразу у всех, а приложение — через сторы, то есть недели. Пока у человека
 * старая сборка, у неё своя вёрстка экрана: панель слева, шапка другой
 * формы. Новый ряд чипов наложился бы на них, поэтому старым сборкам
 * показываем ровно то, что они ждут.
 */
export const PriceFilterLegacy = () => {
  const svgElement = useAtomValue(svgContainerAtom);
  const seatPrices = useAtomValue(seatPricesAtoms);
  const theme = useAtomValue(themeAtom);

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
      {seatPrices.length > 1 && <div onClick={toggle} className={styles.arrow}>
        {isExpended ? (
          <IoIosArrowForward size={11} color={getTextColor(theme || 'dark')}/>
        ) : (
          <IoIosArrowBack size={11} color={getTextColor(theme || 'dark')}/>
        )}
      </div>}
    </div>
  );
};
