import {useCallback, useEffect, useRef} from 'react';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';

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
import {sessionOrderAtom, sessionSlugAtom} from '@atoms/session';
import {urlsAtom} from '@atoms/urls';

import {FullScreenLoader} from '@components/FullScreenLoader';
import {SchemeControl} from '@components/SchemeControl';

import {useRNHandler} from '@utils/message/RNMessageHandler';
import {sendMessageToRN} from '@utils/message/sendMessageToRN';

import {PriceFilter} from '../PriceFilter';
import {SchemeTemplateModal} from '../SchemeTemplateModal';
import styles from './SchemeRenderer.module.scss';

export type ClickedElementType = 'seat' | 'area' | 'sector';

export const SchemeRenderer = () => {
  const parsedScheme = useAtomValue(parsedSchemeAtom);
  const isSchemeLoading = useAtomValue(isSchemeLoadingAtom);
  const sessionOrder = useAtomValue(sessionOrderAtom);
  const selectedSector = useAtomValue(selectedSectorAtom);
  const parsedTemplateScheme = useAtomValue(parsedTemplateSchemeAtom);
  const tickets = useAtomValue(ticketsInCartAtom);
  const [isTemplateOpen, setTemplateOpen] = useAtom(isTemplateModalOpenAtom);

  const setSchemeColors = useSetAtom(setSchemeColorsAtom);
  const onSchemePress = useSetAtom(schemePressHandlerAtom);
  const getTicketsInCart = useSetAtom(getTicketsInCartAtom);
  const setTempUuid = useSetAtom(tempUuidAtom);
  const setSelectedSector = useSetAtom(selectedSectorAtom);
  const getTickets = useSetAtom(getTicketsInCartAtom);
  const setSessionSlug = useSetAtom(sessionSlugAtom);

  const zoomRef = useRef<ReactZoomPanPinchRef | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (svgContainerRef.current) {
      void setSchemeColors(svgContainerRef.current);
    }
  }, [setSchemeColors, parsedScheme]);

  useEffect(() => {
    sendMessageToRN('basketChanged', tickets.length);
  }, [tickets.length]);

  useRNHandler('sessionSlug', data => {
    setTimeout(() => {
      setSessionSlug(data);
    }, 100);
  });
  useRNHandler('user', useSetAtom(userAtom));
  useRNHandler('urls', useSetAtom(urlsAtom));
  useRNHandler('basketChanged', async ticketsCount => {
    if (ticketsCount !== tickets.length) {
      await getTickets();

      if (svgContainerRef?.current) {
        await setSchemeColors(svgContainerRef?.current);
      }
    }
  });

  useRNHandler('tempUuid', async data => {
    setTempUuid(data);
    await getTicketsInCart();
  });

  useRNHandler('zoomIn', () => {
    zoomRef.current?.zoomIn();
  });

  useRNHandler('zoomOut', () => {
    zoomRef.current?.zoomOut();
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

  const handleContentInit = useCallback(
    async (ref: ReactZoomPanPinchRef) => {
      const svgContainer = ref.instance.contentComponent;

      svgContainerRef.current = svgContainer;

      if (svgContainer) {
        await setSchemeColors(svgContainer);
      }
    },
    [setSchemeColors],
  );

  const handleClick = useCallback(
    async (element: Element, type: ClickedElementType) => {
      if (type === 'seat' || type === 'area') {
        await onSchemePress(element);
        return;
      }

      if (type === 'sector') {
        const clickedSector = sessionOrder?.scheme?.sectors?.find(
          item => item.sectorId === element.id,
        );

        if (clickedSector) {
          setSelectedSector(clickedSector);
        }
      }
    },
    [onSchemePress, sessionOrder?.scheme?.sectors, setSelectedSector],
  );

  const toggleTemplateModal = useCallback(() => {
    setTemplateOpen(prev => !prev);
  }, [setTemplateOpen]);

  if (!sessionOrder) {
    return null;
  }

  return (
    <div className={styles.mainContainer}>
      <SchemeControl
        zoomRef={zoomRef}
        onInit={handleContentInit}
        svgContainerRef={svgContainerRef}
        scheme={parsedScheme || parsedTemplateScheme}
        onClick={handleClick}
      />
      <PriceFilter />
      {selectedSector && sessionOrder?.scheme?.sectors?.length && (
        <div
          onClick={toggleTemplateModal}
          className={styles.sectorButtonContainer}>
          <div className={styles.sectorButtonHelper}>Выбрать другую секцию</div>
          <div className={styles.sectorButton}>{selectedSector?.title}</div>
        </div>
      )}
      <SchemeTemplateModal
        scheme={parsedTemplateScheme}
        isOpen={isTemplateOpen}
        setIsOpen={setTemplateOpen}
      />
      {isSchemeLoading && <FullScreenLoader />}
    </div>
  );
};
