import {
  isSchemeLoadingAtom,
  setSchemeColorsAtom,
  svgContainerAtom,
} from '@atoms/scheme/setSchemeColors.atoms';
import {Sector, sessionOrderAtom} from '@atoms/session';
import {getScheme} from '@services/getScheme';
import htmlReactParser from 'html-react-parser';
import {atom} from 'jotai';
import {ReactNode} from 'react';

export const isTemplateModalOpenAtom = atom(false);

export const selectedSectorAtom = atom<null | Sector>(null);

export const parsedSectorSchemeAtom = atom<ReactNode>(null);

export const onSectorClickAtom = atom(
  null,
  async (get, set, element: Element) => {
    try {
      const sessionOrder = await get(sessionOrderAtom);

      const clickedSector = sessionOrder?.scheme?.sectors?.find(
        item => item.sectorId === element.id,
      );

      if (clickedSector) {
        set(isSchemeLoadingAtom, true);
        const schemeString = await getScheme(clickedSector.htmlPath);
        const parsedScheme = htmlReactParser(schemeString || '');

        set(parsedSectorSchemeAtom, parsedScheme);

        set(selectedSectorAtom, clickedSector);

        const svgContainerElement = get(svgContainerAtom);
        if (svgContainerElement) {
          await set(setSchemeColorsAtom, svgContainerElement);
        }
      }
    } catch (e) {
    } finally {
      set(isSchemeLoadingAtom, false);
    }
  },
);
