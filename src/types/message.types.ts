import {User} from '@atoms/auth';
import {URLs} from '@atoms/urls/urls.atoms';

export type FromWebActions = {
  isReady: boolean;
  basketChanged: number;
  noScheme: boolean;
  isSectorModalChanged: boolean;
};

export type FromWebActionName = keyof FromWebActions;

export type FromNativeActions = {
  user: User | null;
  tempUuid: string | null;
  urls: URLs;
  sessionSlug: string;
  basketChanged: number;
  zoomIn: boolean;
  zoomOut: boolean;
  theme: 'dark' | 'light';
};

export type FromNativeActionName = keyof FromNativeActions;
