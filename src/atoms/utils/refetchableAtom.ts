import {atom, Getter, Setter} from 'jotai';

export type Options = {
  signal: AbortSignal;
};

export declare type Fn<Value> = (get: Getter, options: Options) => Value;

export const refetchableAtom = <Value>(fn: Fn<Promise<Value>>) => {
  const refetchAtom = atom(true);

  return atom(
    async (get: Getter, options: Options): Promise<Value> => {
      get(refetchAtom);
      return await fn(get, options);
    },

    (get: Getter, set: Setter) => {
      set(refetchAtom, !get(refetchAtom));
    },
  );
};
