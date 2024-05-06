import {selectedSectorAtom} from '@atoms/scheme';
import {sessionOrderAtom} from '@atoms/session';
import {SchemeControl} from '@components/SchemeControl';
import {ClickedElementType} from '@features/SchemeRenderer';
import {colors} from '@utils/const/colors';
import {setGroupColor, setSchemeColors} from '@utils/setSchemeColors';
import {useAtomValue, useSetAtom} from 'jotai';
import {ReactNode, useCallback, useRef} from 'react';
import {IoClose} from 'react-icons/io5';
import Modal from 'react-modal';
import {ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';

import styles from './SchemeTemplateModal.module.scss';

export type SchemeTemplateModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  scheme: ReactNode;
};

const modalStyles: Modal.Styles = {
  content: {
    background: '#1d2228',
    border: 'none',
    top: 50,
    left: 12,
    bottom: 50,
    right: 12,
    zIndex: 100,
    display: 'block',
    borderRadius: 12,
  },
  overlay: {background: colors['extra-blur']},
};

export const SchemeTemplateModal = ({
  isOpen,
  setIsOpen,
  scheme,
}: SchemeTemplateModalProps) => {
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
            setGroupColor(elItem, 'default', 'sector', colors.blue);
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
        <div className={styles.title}>Выберите сектор</div>
        <IoClose onClick={handleCloseModal} size={24} />
      </div>
      <div className={styles.content}>
        <SchemeControl
          onInit={handleContentInit}
          svgContainerRef={svgContainerRef}
          scheme={scheme}
          onClick={handleClick}
        />
      </div>
    </Modal>
  );
};
