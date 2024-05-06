import {User} from '@atoms/auth';
import {URLs} from '@atoms/urls/urls.atoms';

export type FromWebActions = {
  isReady: boolean;
  basketChanged: number;
  noScheme: boolean;
};

export type FromWebActionName = keyof FromWebActions;

export type FromNativeActions = {
  user: User;
  tempUuid: string;
  urls: URLs;
  sessionSlug: string;
  basketChanged: number;
  zoomIn: boolean;
  zoomOut: boolean;
};

export type FromNativeActionName = keyof FromNativeActions;
