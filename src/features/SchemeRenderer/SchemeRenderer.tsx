import {themeAtom} from '@atoms/theme';
import {getTextColor} from '@utils/getTextColor';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';

import classNames from 'classnames';

import {paymentMethodsAtom} from '@atoms/paymentMethods';
import {
  appBackgroundAtom,
  appOverlayAtom,
  LEGACY_SCHEME_UI,
  schemeUiVersionAtom,
} from '@atoms/schemeUi';
import {tempUuidAtom, userAtom} from '@atoms/auth';
import {getTicketsInCartAtom, ticketsInCartAtom} from '@atoms/cart';
import {
  isSchemeLoadingAtom,
  isTemplateModalOpenAtom,
  parsedSchemeAtom,
  selectedSectorAtom,
  setSchemeColorsAtom,
} from '@atoms/scheme';
import {schemePressHandlerAtom} from '@atoms/scheme/schemePressHandler.atoms';
import {parsedTemplateSchemeAtom} from '@atoms/schemeTemplate';
import {sessionAtom, sessionOrderAtom, sessionSlugAtom} from '@atoms/session';
import {urlsAtom} from '@atoms/urls';

import {FullScreenLoader} from '@components/FullScreenLoader';
import {PlacePendingLoader} from '@components/PlacePendingLoader';
import {SchemeControl} from '@components/SchemeControl';

import {useRNHandler} from '@utils/message/RNMessageHandler';
import {sendMessageToRN} from '@utils/message/sendMessageToRN';
import {lockPlaceClick, unlockPlaceClick} from '@utils/placeClickLock';
import {
  getElementPlace,
  getPlaceDiscountLines,
} from '@utils/seatDiscounts';

import {PriceFilter} from '../PriceFilter';
import {SchemeTemplateModal} from '../SchemeTemplateModal';
import styles from './SchemeRenderer.module.scss';
import {ESBOAreaClickAtom, ESBOSeatClickAtom, ESBOSeatsAtom, setESBOSeatsAtom} from "@atoms/ESBO";
import {getESBOSeatElementKey} from "@utils/getESBOSeatKey";

export type ClickedElementType = 'seat' | 'area' | 'sector';

export const SchemeRenderer = () => {
  const parsedScheme = useAtomValue(parsedSchemeAtom);
  const theme = useAtomValue(themeAtom);
  const isSchemeLoading = useAtomValue(isSchemeLoadingAtom);
  const sessionOrder = useAtomValue(sessionOrderAtom);
  const session = useAtomValue(sessionAtom)
  const paymentMethods = useAtomValue(paymentMethodsAtom);
  /**
   * Пока приложение не прислало своё поколение вёрстки, считаем сборку
   * старой: там шапка и панель лежат поверх вебвью, и схема должна
   * занимать весь экран, как раньше.
   */
  const isColumnUi = useAtomValue(schemeUiVersionAtom) > LEGACY_SCHEME_UI;
  /** Цвет берём только в новой вёрстке: в старой схема и так на весь экран. */
  const appBackground = useAtomValue(appBackgroundAtom);
  const background = (isColumnUi && appBackground) || undefined;
  const selectedSector = useAtomValue(selectedSectorAtom);
  const parsedTemplateScheme = useAtomValue(parsedTemplateSchemeAtom);
  const tickets = useAtomValue(ticketsInCartAtom);
  const [isTemplateOpen, setTemplateOpen] = useAtom(isTemplateModalOpenAtom);

  const setSchemeColors = useSetAtom(setSchemeColorsAtom);
  const setESBOSeats = useSetAtom(setESBOSeatsAtom);
  const onSchemePress = useSetAtom(schemePressHandlerAtom);
  const setSeats = useSetAtom(ESBOSeatsAtom)
  const onESBOSeatPress = useSetAtom(ESBOSeatClickAtom);
  const onESBOAreaClickPress = useSetAtom(ESBOAreaClickAtom);
  const getTicketsInCart = useSetAtom(getTicketsInCartAtom);
  const setTempUuid = useSetAtom(tempUuidAtom);
  const setSelectedSector = useSetAtom(selectedSectorAtom);
  const getTickets = useSetAtom(getTicketsInCartAtom);
  const [, setSessionSlug] = useAtom(sessionSlugAtom);
  const setUser = useSetAtom(userAtom);

  const zoomRef = useRef<ReactZoomPanPinchRef | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  /** Читает наблюдатель за размером — ему нужно свежее, а не из замыкания. */
  const ticketsCountRef = useRef(0);
  const isColumnUiRef = useRef(false);
  /** Идёт добавление места в корзину, а не загрузка схемы. */
  const [isPlacePending, setIsPlacePending] = useState(false);

  useEffect(() => {
    if (svgContainerRef.current) {
      void setSchemeColors(svgContainerRef.current);
    }
  }, [setSchemeColors, parsedScheme]);

  /**
   * Подсказку к зоне привязываем только там, где есть что сказать про
   * скидку: своего текста у зоны нет, и пустая плашка никому не нужна.
   * У брендов без скидок не навешивается вообще ничего.
   */
  useEffect(() => {
    const container = svgContainerRef.current;

    if (!container) {
      return;
    }

    const areas = container
      .querySelector('#areas')
      ?.querySelectorAll('[id^="area_"]');

    areas?.forEach(element => {
      const area = session?.scheme?.areas?.find(
        item => item.schemeArea?.htmlId === element.id,
      );
      const hasDiscount =
        !!area && getPlaceDiscountLines({areaId: area.id}, session).length > 0;

      if (hasDiscount) {
        element.setAttribute('data-tooltip-id', 'seat-tooltip');
      } else {
        element.removeAttribute('data-tooltip-id');
      }
    });
  }, [parsedScheme, session]);

  useEffect(() => {
    ticketsCountRef.current = tickets.length;
    sendMessageToRN('basketChanged', tickets.length);
  }, [tickets.length]);

  useEffect(() => {
    sendMessageToRN('isSectorModalChanged', isTemplateOpen);
  }, [isTemplateOpen]);

  useEffect(() => {
    sendMessageToRN('isSectorOpen', !!selectedSector)
  }, [selectedSector])

  useRNHandler('sessionSlug', data => {
    setTimeout(() => {
      setSessionSlug(data);
    }, 100);
  });

  useRNHandler('user', data => {
    setTimeout(async () => {
      await setUser(data);
      if (data) {
        await getTicketsInCart();
      }
    }, 100);
  });
  useRNHandler('urls', useSetAtom(urlsAtom));
  /** Каталог способов оплаты: нужен только для названия в подсказке. */
  useRNHandler('paymentMethods', useSetAtom(paymentMethodsAtom));
  /** Пока сообщения нет, считаем сборку старой и не меняем вёрстку. */
  useRNHandler('schemeUi', useSetAtom(schemeUiVersionAtom));
  /** Фон экрана приложения — схема встаёт с ним в один столбец. */
  useRNHandler('backgroundColor', useSetAtom(appBackgroundAtom));
  /** Завеса модалки — общая со светом, которым приложение гасит шапку. */
  useRNHandler('overlayColor', useSetAtom(appOverlayAtom));
  useRNHandler('basketChanged', async ticketsCount => {
    if (ticketsCount !== tickets.length) {
      await getTickets();

      if (svgContainerRef?.current) {
        if(session?.outerSessionId) {
          await setSeats()
          await setESBOSeats(svgContainerRef?.current);
        } else {
          await setSchemeColors(svgContainerRef?.current);
        }
      }
    }
  });

  useRNHandler('tempUuid', async data => {
    await setTempUuid(data);

    if (data) {
      await getTicketsInCart();
    }
  });

  useRNHandler('zoomIn', () => {
    zoomRef.current?.zoomIn();
  });
  useRNHandler('zoomOut', () => {
    zoomRef.current?.zoomOut();
  });

  useRNHandler('theme', useSetAtom(themeAtom));

  useRNHandler('isSectorOpen', (data) => {
    if(!data){
      setSelectedSector(null)
    }
  });

  useEffect(() => {
    sendMessageToRN('isReady', true);
  }, []);

  useEffect(() => {
    if (sessionOrder) {
      if (!sessionOrder?.scheme?.id) {
        sendMessageToRN('noScheme', true);
      }
    }
  }, [sessionOrder]);

  /**
   * Поколение вёрстки приходит сообщением уже после того, как зал
   * проинициализировался, поэтому наблюдатель читает его из ссылки.
   */
  useEffect(() => {
    isColumnUiRef.current = isColumnUi;
  }, [isColumnUi]);

  /** Следить за окном зала перестаём вместе с экраном. */
  useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

  const handleContentInit = useCallback(
    async (ref: ReactZoomPanPinchRef) => {
      const svgContainer = ref.instance.contentComponent;

      svgContainerRef.current = svgContainer;

      /**
       * Зал центруется один раз, на запуске. Но полоса чипов появляется
       * позже: цены известны только из разобранной схемы, — и окно зала от
       * неё становится ниже, а зал остаётся стоять по старому центру.
       * Поэтому следим за размером окна и центруем заново.
       */
      const wrapper = ref.instance.wrapperComponent;

      if (wrapper && !resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          /**
           * У старых сборок приложения зал и так на весь экран, и ничего
           * его не двигает — там не вмешиваемся вовсе. С первым выбранным
           * местом замолкаем тоже: человек уже работает с залом, и двигать
           * его под пальцем нельзя.
           */
          if (
            isColumnUiRef.current &&
            !ticketsCountRef.current &&
            zoomRef.current?.instance.transformState.scale === 1
          ) {
            zoomRef.current.centerView(undefined, 0);
          }
        });

        resizeObserverRef.current.observe(wrapper);
      }

      if (svgContainer) {

        if(session?.outerSessionId) {
          await setESBOSeats(svgContainer)

          return
        }

        await setSchemeColors(svgContainer);
      }
    },
    [session, setESBOSeats, setSchemeColors],
  );

  /**
   * Скидки в подсказку у места или зоны. Теперь они действуют на
   * перечисленные места и зоны, а не на весь заказ, — до выбора иначе
   * неоткуда узнать, что именно это место дешевле.
   */
  const getPlaceLines = useCallback(
    (element: Element) => {
      if (element.id.startsWith('area_')) {
        const area = session?.scheme?.areas?.find(
          item => item.schemeArea?.htmlId === element.id,
        );

        return area
          ? getPlaceDiscountLines({areaId: area.id}, session, paymentMethods)
          : [];
      }

      return getPlaceDiscountLines(
        getElementPlace(element),
        session,
        paymentMethods,
      );
    },
    [paymentMethods, session],
  );

  const handleClick = useCallback(
    async (element: SVGElement, type: ClickedElementType) => {
      const seatKey = getESBOSeatElementKey(element);

      /**
       * Тап по месту или зоне уходит запросом в корзину. Пока он идёт,
       * повторные тапы отсекаем: иначе второй либо займёт ещё одно место,
       * либо снимет только что занятое.
       */
      const isPlace = type === 'seat' || type === 'area';

      if (isPlace && !lockPlaceClick()) {
        return;
      }

      try {
        if (session?.outerSessionId) {
          if (seatKey && type === 'seat') {
            setIsPlacePending(true);
            await onESBOSeatPress(seatKey);
          }

          if (type === 'area' && element.dataset.sector) {
            setIsPlacePending(true);
            await onESBOAreaClickPress(element.dataset.sector);
          }

          return;
        }

        if (isPlace) {
          setIsPlacePending(true);
          await onSchemePress(element);

          return;
        }

        if (type === 'sector') {
          const clickedSector = sessionOrder?.scheme?.sectors?.find(
            item => item.sectorId === element.id,
          );

          if (clickedSector && element.dataset.status !== 'ordered') {
            setSelectedSector(clickedSector);
          }
        }
      } finally {
        /**
         * И при отказе тоже: иначе схема осталась бы заблокированной, а
         * индикатор висел бы до перезагрузки вебвью.
         */
        if (isPlace) {
          unlockPlaceClick();
          setIsPlacePending(false);
        }
      }
    },
    [onESBOAreaClickPress, onESBOSeatPress, onSchemePress, session?.outerSessionId, sessionOrder?.scheme?.sectors, setSelectedSector],
  );

  const toggleTemplateModal = useCallback(() => {
    setTemplateOpen(prev => !prev);
  }, [setTemplateOpen]);

  if (!sessionOrder) {
    return null;
  }

  return (
    <div
      style={background ? {background} : undefined}
      className={classNames(styles.mainContainer, {
        [styles.column]: isColumnUi,
      })}>
      <SchemeControl
        zoomRef={zoomRef}
        onInit={handleContentInit}
        svgContainerRef={svgContainerRef}
        scheme={parsedScheme || parsedTemplateScheme}
        onClick={handleClick}
        background={background}
        heightClass={isColumnUi ? styles.schemeFill : undefined}
        placeExtraLines={getPlaceLines}
      />
      {!session?.outerSessionId && <PriceFilter/>}
      {selectedSector && sessionOrder?.scheme?.sectors?.length && (
        <div
          onClick={toggleTemplateModal}
          className={styles.sectorButtonContainer}>
          <div className={styles.sectorButton}>Выбрать другую секцию</div>
        </div>
      )}
      {selectedSector?.title && (
        <div
          style={{color: getTextColor(theme || 'dark')}}
          className={styles.sectorTitle}>
          {selectedSector?.title}
        </div>
      )}
      <SchemeTemplateModal
        scheme={parsedTemplateScheme}
        isOpen={isTemplateOpen}
        setIsOpen={setTemplateOpen}
      />
      {/**
       * Схему гасим только на её собственной загрузке. Добавление места —
       * это короткий запрос, и закрывать из-за него весь зал незачем:
       * человеку надо видеть, куда он тапнул.
       */}
      {isPlacePending && <PlacePendingLoader />}
      {isSchemeLoading && !isPlacePending && (
        <FullScreenLoader text="Загружается схема..." />
      )}
    </div>
  );
};
