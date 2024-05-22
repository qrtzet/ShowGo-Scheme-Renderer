import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

export type User = {
  id: number;
  createdAt: string;
  email: string | null;
  fullName: string | null;
  phoneNumber: string;
  updatedAt: null;
  token: string;
};

export const userAtom = atomWithStorage<User | null>('user', null, undefined, {
  getOnInit: true,
});

export const tempUuidAtom = atomWithStorage<string | null>(
  'tempUuid',
  null,
  undefined,
  {getOnInit: true},
);

export const isAuthReadyAtom = atom(get => {
  const user = get(userAtom);
  const tempUuid = get(tempUuidAtom);

  return !!user || !!tempUuid;
});
