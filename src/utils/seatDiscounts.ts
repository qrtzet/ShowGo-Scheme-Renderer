import {PaymentMethodBrief} from '@atoms/paymentMethods';
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

/**
 * Читаемое имя способа оплаты. Каталог приложение присылает сообщением; если
 * оно ещё не пришло или метода там нет — чистим код от технического суффикса,
 * чтобы не показывать человеку `demir_webhook`. Правило то же, что в
 * приложении, иначе подписи на схеме и на экране события разойдутся.
 */
const paymentMethodName = (code: string, payments?: PaymentMethodBrief[]) => {
  const title = payments?.find(method => method.code === code)?.title?.trim();

  if (title) {
    return title;
  }

  return capitalize(
    code.replace(/_(webhook|classic)$/i, '').replace(/_/g, ' '),
  );
};

const discountLine = (
  discount: Discount,
  payments?: PaymentMethodBrief[],
): string | null => {
  if (discount.method?.name === 'event_ticket_quantity') {
    const from =
      discount.quantity && discount.quantity > 1
        ? ` от ${discount.quantity} билетов`
        : '';

    return `Скидка ${amountText(discount)}${from}`;
  }

  if (discount.method?.name === 'payment_method_event') {
    const code = discount.payload?.paymentMethodCode;

    return code
      ? `Скидка ${amountText(discount)} при оплате через ${paymentMethodName(
          code,
          payments,
        )}`
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
  payments?: PaymentMethodBrief[],
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
    .map(discount => discountLine(discount, payments))
    .filter((line): line is string => !!line);
};

/** Место со схемы: сектор, ряд и номер лежат в data-атрибутах группы. */
export const getElementPlace = (element: Element): DiscountPlace => ({
  sector: element.getAttribute('data-sector'),
  row: element.getAttribute('data-row'),
  seat: element.getAttribute('data-seat'),
});
