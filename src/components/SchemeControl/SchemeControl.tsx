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
};

export const SchemeControl = ({
  zoomRef,
  onInit,
  svgContainerRef,
  scheme,
  onClick,
  heightClass,
  isInModal = false,
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

      if (sectorElement && onClick) {
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
            backgroundColor: theme === 'dark' ? '#212121' : '#ebebeb',
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
        delayHide={1000}
        className={styles.tooltip}
        render={({activeAnchor}) => (
          <div className={styles.text}>
            {activeAnchor && generateSeatText(activeAnchor)}
          </div>
        )}
      />
    </>
  );
};
