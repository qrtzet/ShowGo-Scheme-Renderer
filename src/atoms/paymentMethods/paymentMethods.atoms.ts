import {atom} from 'jotai';

/**
 * Способы оплаты, как их знает покупатель.
 *
 * Своей ручки каталога у схемы нет, да и незачем: приложение всё равно его
 * запрашивает для экрана оплаты и присылает сюда сообщением. Нужно только
 * ради названия в подсказке о скидке — в самой скидке приходит код
 * (`demir_webhook`), а человеку надо «Demir App».
 */
export type PaymentMethodBrief = {
  code: string;
  title: string;
};

export const paymentMethodsAtom = atom<PaymentMethodBrief[]>([]);
