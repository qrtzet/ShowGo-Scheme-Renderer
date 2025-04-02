import {Session} from '@atoms/session';
import {getSession} from '@services/getSession';
import {atom} from 'jotai';

export const sessionSlugAtom = atom<string | null>(null);

export const sessionAtom = atom(async (get): Promise<Session | null> => {
  try {
    const slug = get(sessionSlugAtom);

    if (slug) {
      const {payload} = await getSession({slug});

      return payload;
    }

    return null;
  } catch (e) {
    return null;
  }
});
