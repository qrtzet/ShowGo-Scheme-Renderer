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

export const userAtom = atomWithStorage<User | null>('user', null);

export const tempUuidAtom = atomWithStorage<string | null>('tempUuid', null);
