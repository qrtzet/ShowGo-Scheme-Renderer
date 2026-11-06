import {User} from '@atoms/auth';
import {PaymentMethodBrief} from '@atoms/paymentMethods';
import {URLs} from '@atoms/urls/urls.atoms';

export type FromWebActions = {
  isReady: boolean;
  basketChanged: number;
  noScheme: boolean;
  isSectorModalChanged: boolean;
  isSectorOpen: boolean;
};

export type FromWebActionName = keyof FromWebActions;

export type FromNativeActions = {
  user: User | null;
  tempUuid: string | null;
  /** Каталог способов оплаты — нужен для названия в подсказке о скидке. */
  paymentMethods: PaymentMethodBrief[];
  /**
   * Поколение вёрстки экрана в приложении. Присылают только сборки с новым
   * экраном выбора мест; молчание означает старую сборку.
   */
  schemeUi: number;
  urls: URLs;
  sessionSlug: string;
  basketChanged: number;
  zoomIn: boolean;
  zoomOut: boolean;
  theme: 'dark' | 'light';
  isSectorOpen: boolean;
};

export type FromNativeActionName = keyof FromNativeActions;
