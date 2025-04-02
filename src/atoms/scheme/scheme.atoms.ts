import {selectedSectorAtom} from '@atoms/scheme/sector.atoms';
import {atom} from 'jotai';

import {getScheme} from '@services/getScheme';
import {sessionOrderAtom} from '@atoms/session';
import htmlReactParser from 'html-react-parser';

export const schemeStringAtom = atom(async (get, set) => {
  try {
    const sessionOrder = await get(sessionOrderAtom);
    const selectedSector = get(selectedSectorAtom);

    if (sessionOrder) {
      if (sessionOrder?.scheme?.sectors?.length) {
        return selectedSector ? await getScheme(selectedSector.htmlPath) : null;
      }

      return sessionOrder?.scheme?.htmlPath
        ? await getScheme(sessionOrder.scheme.htmlPath)
        : null;
    }
  } catch (e) {
    return null;
  }
});

export const parsedSchemeAtom = atom(async get => {
  const schemeString = await get(schemeStringAtom);

  return schemeString ? htmlReactParser(schemeString || '') : null;
});
