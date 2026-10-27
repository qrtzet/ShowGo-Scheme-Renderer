import {Discount, DiscountScope, Session} from '@atoms/session';
import {priceWithSymbol} from '@utils/const/locale';

/** Место или зона, про которые спрашиваем, есть ли на них скидка. */
export type DiscountPlace = {
  sector?: string | null;
  row?: string | null;
  seat?: string | null;
  areaId?: number | null;
};

/** `null` в scope значит «любое значение подходит». */
const isAny = (
  expected: string | number | null | undefined,
  actual: string | number | null | undefined,
) => expected == null || expected === actual;

/** Ключи приходят в двух написаниях — см. комментарий у `DiscountScope`. */
const scopeSession = (scope: DiscountScope) =>
  scope.sessionId ?? scope.session_id ?? null;

const scopeArea = (scope: DiscountScope) =>
  scope.ticketAreaId ?? scope.ticket_area_id ?? null;

export const inScope = (
  place: DiscountPlace,
  sessionId: number | null,
  scopes?: DiscountScope[] | null,
): boolean => {
  /** Скидка без ограничений действует на всё. */
  if (!scopes?.length) {
    return true;
  }

  if (place.areaId != null) {
    return scopes.some(
      scope =>
        scope.sector == null &&
        scope.row == null &&
        scope.seat == null &&
        isAny(scopeSession(scope), sessionId) &&
        isAny(scopeArea(scope), place.areaId),
    );
  }

  if (place.sector != null || place.row != null || place.seat != null) {
    return scopes.some(
      scope =>
        scopeArea(scope) == null &&
        isAny(scopeSession(scope), sessionId) &&
        isAny(scope.sector, place.sector) &&
        isAny(scope.row, place.row) &&
        isAny(scope.seat, place.seat),
    );
  }

  return false;
};

const amountText = (discount: Discount) =>
  discount.discountType === 'PERCENT'
    ? `${discount.discountAmount}%`
    : priceWithSymbol(discount.discountAmount);

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const discountLine = (discount: Discount): string | null => {
  if (discount.method?.name === 'event_ticket_quantity') {
    const from = discount.quantity && discount.quantity > 1
      ? ` от ${discount.quantity} билетов`
      : '';

    return `Скидка ${amountText(discount)}${from}`;
  }

  if (discount.method?.name === 'payment_method_event') {
    /**
     * Названия способов оплаты в рендерер не приезжают — показываем код,
     * как он задан в админке.
     */
    const code = discount.payload?.paymentMethodCode;

    return code
      ? `Скидка ${amountText(discount)} при оплате через ${capitalize(code)}`
      : `Скидка ${amountText(discount)}`;
  }

  return null;
};

/**
 * Подписи о скидках на конкретном месте или в зоне — то же, что показывает
 * сайт в подсказке у места. Скидка теперь действует не на весь заказ, а на
 * перечисленные в `scopes` места, поэтому до выбора человеку иначе неоткуда
 * узнать, что именно это место дешевле.
 */
export const getPlaceDiscountLines = (
  place: DiscountPlace,
  session?: Session | null,
): string[] => {
  if (!session?.discounts?.length) {
    return [];
  }

  return session.discounts
    .filter(
      discount =>
        /** Выключенная скидка по способу оплаты: количество обнулено. */
        !(
          discount.method?.name === 'payment_method_event' &&
          discount.quantity === 0
        ) && inScope(place, session.id, discount.scopes),
    )
    .map(discountLine)
    .filter((line): line is string => !!line);
};

/** Место со схемы: сектор, ряд и номер лежат в data-атрибутах группы. */
export const getElementPlace = (element: Element): DiscountPlace => ({
  sector: element.getAttribute('data-sector'),
  row: element.getAttribute('data-row'),
  seat: element.getAttribute('data-seat'),
});
