import {selectedSectorAtom} from '@atoms/scheme';
import {sessionOrderAtom} from '@atoms/session';
import {themeAtom} from '@atoms/theme';
import {SchemeControl} from '@components/SchemeControl';
import {ClickedElementType} from '@features/SchemeRenderer';
import {colors} from '@utils/const/colors';
import {getTextColor} from '@utils/getTextColor';
import {setGroupColor, setSchemeColors} from '@utils/setSchemeColors';
import {useAtomValue, useSetAtom} from 'jotai';
import {ReactNode, useCallback, useMemo, useRef} from 'react';
import {IoClose} from 'react-icons/io5';
import Modal from 'react-modal';
import {ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';

import styles from './SchemeTemplateModal.module.scss';

export type SchemeTemplateModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  scheme: ReactNode;
};

export const SchemeTemplateModal = ({
  isOpen,
  setIsOpen,
  scheme,
}: SchemeTemplateModalProps) => {
  const theme = useAtomValue(themeAtom);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const sessionOrder = useAtomValue(sessionOrderAtom);
  const setSelectedSector = useSetAtom(selectedSectorAtom);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleClick = useCallback(
    (element: Element, type: ClickedElementType) => {
      if (type === 'sector') {
        const clickedSector = sessionOrder?.scheme?.sectors?.find(
          item => item.sectorId === element.id,
        );

        if (clickedSector) {
          setIsOpen(false);
          setTimeout(() => {
            setSelectedSector(clickedSector);
          }, 500);
        }
      }
    },
    [sessionOrder?.scheme?.sectors, setIsOpen, setSelectedSector],
  );

  const modalStyles: Modal.Styles = useMemo(
    () => ({
      content: {
        background: theme === 'dark' ? '#19242d' : colors.white,
        border: 'none',
        top: 160,
        left: 12,
        bottom: 100,
        right: 12,
        zIndex: 100,
        padding: 12,
        display: 'block',
        borderRadius: 12,
      },
      overlay: {background: colors['extra-blur']},
    }),
    [theme],
  );

  const handleContentInit = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      const svgElement = ref.instance.contentComponent?.children[0];

      if (svgElement) {
        setSchemeColors(svgElement, 'default');

        const sectorElements = svgElement?.querySelectorAll('[id^="sector_"]');

        Array.from(sectorElements || []).forEach(elItem => {
          if (
            sessionOrder?.scheme?.sectors?.find(
              item => item.sectorId === elItem.id,
            )
          ) {
            setGroupColor(elItem, 'default', 'sector');
            return;
          }

          setGroupColor(elItem, 'disabled', 'sector');
        });
      }
    },
    [sessionOrder?.scheme?.sectors],
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={modalStyles}>
      <div className={styles.header}>
        <div
          className={styles.title}
          style={{color: getTextColor(theme || 'light')}}>
          Выберите сектор
        </div>
        <IoClose
          onClick={handleCloseModal}
          size={24}
          color={getTextColor(theme || 'light')}
        />
      </div>
      <div
        className={styles.content}
        style={{background: theme === 'dark' ? colors.black : colors.white}}>
        <SchemeControl
          isInModal
          onInit={handleContentInit}
          svgContainerRef={svgContainerRef}
          scheme={scheme}
          onClick={handleClick}
          heightClass={styles.height}
        />
      </div>
    </Modal>
  );
};
