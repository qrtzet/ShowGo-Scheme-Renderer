import {sessionOrderAtom} from '@atoms/session';
import {getScheme} from '@services/getScheme';
import htmlReactParser from 'html-react-parser';
import {atom} from 'jotai';

export const schemeTemplateStringAtom = atom(async (get, set) => {
  try {
    const sessionOrder = await get(sessionOrderAtom);

    if (sessionOrder?.scheme?.sectors?.length) {
      return await getScheme(sessionOrder.scheme.htmlPath);
    }

    return null;
  } catch (e) {
    return null;
  }
});

export const parsedTemplateSchemeAtom = atom(async get => {
  const schemeString = await get(schemeTemplateStringAtom);

  return schemeString ? htmlReactParser(schemeString) : null;
});
