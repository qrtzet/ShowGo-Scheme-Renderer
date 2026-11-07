import {themeAtom} from '@atoms/theme';
import {ClickedElementType} from '@features/SchemeRenderer';
import {generateSeatText} from '@utils/generateSeatText';
import classNames from 'classnames';
import {useAtomValue} from 'jotai';
import {LegacyRef, ReactNode, RefObject, useCallback, useEffect} from 'react';
import {Tooltip} from 'react-tooltip';
import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';

import styles from './SchemeControl.module.scss';

export type SchemeControlProps = {
  zoomRef?: LegacyRef<ReactZoomPanPinchContentRef>;
  onInit?: (ref: ReactZoomPanPinchRef) => void;
  svgContainerRef: RefObject<HTMLDivElement | null>;
  scheme: ReactNode;
  onClick: (element: SVGElement, type: ClickedElementType) => void;
  isInModal?: boolean;
  heightClass?: string;
  /**
   * Фон окна зала. В новой вёрстке его задаёт приложение, чтобы схема и
   * нативная шапка стояли на одном цвете; без него остаётся свой серый.
   */
  background?: string;
  /**
   * Что добавить в подсказку к месту или зоне — у нас это скидки на них.
   * Знание о скидках живёт в SchemeRenderer, у которого есть сеанс.
   */
  placeExtraLines?: (element: Element) => string[];
};

export const SchemeControl = ({
  zoomRef,
  onInit,
  svgContainerRef,
  scheme,
  onClick,
  heightClass,
  background,
  isInModal = false,
  placeExtraLines,
}: SchemeControlProps) => {
  const theme = useAtomValue(themeAtom);

  const clickEventListener = useCallback(
    async (e: MouseEvent) => {
      const targetElement = e.target as SVGElement;

      const seatElement = targetElement.closest(
        'g[data-sector][data-row][data-seat][data-color]',
      );
      const areaElement = targetElement.closest('g[data-title][data-color]');

      const sectorElement = targetElement.closest(
        'g[id^="sector_"][data-title]',
      );

      // Сектор с data-status="ordered" (нет свободных мест) — не кликабелен
      if (
        sectorElement &&
        onClick &&
        !['ordered', 'booked'].includes(
          sectorElement.getAttribute('data-status') || '',
        )
      ) {
        onClick(sectorElement as SVGElement, 'sector');
      }

      if (
        seatElement?.id.startsWith('seat_') &&
        onClick &&
        !['ordered', 'booked'].includes(
          seatElement.getAttribute('data-status') || '',
        )
      ) {
        onClick(seatElement as SVGElement, 'seat');
      }

      if (areaElement?.id.startsWith('area_') && onClick) {
        onClick(areaElement as SVGElement, 'area');
      }
    },
    [onClick],
  );

  useEffect(() => {
    svgContainerRef?.current?.addEventListener('click', clickEventListener);

    return () => {
      svgContainerRef?.current?.removeEventListener(
        'click',
        clickEventListener,
      );
    };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  }, [clickEventListener, scheme, svgContainerRef]);

  return (
    <>
      <TransformWrapper
        ref={zoomRef}
        minScale={1}
        initialScale={1}
        maxScale={10}
        centerZoomedOut
        centerOnInit
        onInit={onInit}>
        <TransformComponent
          contentClass={classNames(styles.content, heightClass)}
          wrapperStyle={{
            backgroundColor:
              background || (theme === 'dark' ? '#212121' : '#ebebeb'),
          }}
          wrapperClass={classNames(styles.container, heightClass, {
            [styles.modal]: isInModal,
          })}>
          <div
            ref={svgContainerRef}
            className={classNames(styles.svgContainer, heightClass, {
              [styles.modal]: isInModal,
            })}>
            {scheme}
          </div>
        </TransformComponent>
      </TransformWrapper>
      <Tooltip
        id="seat-tooltip"
        variant="light"
        delayShow={1000}
        delayHide={0}
        className={styles.tooltip}
        render={({activeAnchor}) => {
          const isSeat = !!activeAnchor?.id.startsWith('seat_');
          const isArea = !!activeAnchor?.id.startsWith('area_');

          if (!activeAnchor || (!isSeat && !isArea)) {
            return null;
          }

          /** У выкупленного места скидка уже ничего не значит. */
          const lines = activeAnchor.getAttribute('data-status')
            ? []
            : placeExtraLines?.(activeAnchor) || [];

          /**
           * У зоны своего текста нет. Подсказку к ней привязывают только при
           * наличии скидки, но если данные успели обновиться — молчим.
           */
          if (isArea && !lines.length) {
            return null;
          }

          return (
            <div className={styles.text}>
              {isSeat && generateSeatText(activeAnchor)}
              {lines.map(line => (
                <div key={line}>{line}</div>
              ))}
            </div>
          );
        }}
      />
    </>
  );
};
