import {isAuthReadyAtom} from '@atoms/auth';
import {atom} from 'jotai';

import {selectedSectorAtom} from '@atoms/scheme';

import {getSessionOrder} from '@services/getSessionOrder';
import {getSessionOrderItems} from '@services/getSessionOrderItems';

import {sessionAtom, sessionSlugAtom} from './session.atoms';
import {Area, OrderItem, SeatScheme, Session} from './session.types';

export type OrderSeatsScheme = Map<string, SeatScheme>;
export type OrderAreasScheme = Map<string, Area>;
export type OrderItems = Map<string, OrderItem>;

export type SessionOrderScheme = {
  seats: OrderSeatsScheme;
  areas: OrderAreasScheme;
  orderItems: OrderItems;
};

export const sessionOrderAtom = atom<Promise<Session | null>>(async get => {
  try {
    const slug = get(sessionSlugAtom);
    const isAuthReady = get(isAuthReadyAtom);

    if (slug && isAuthReady) {
      const {payload} = await getSessionOrder({slug});

      return payload;
    }

    return null;
  } catch (e) {
    return null;
  }
});

export const sessionOrderItemsAtom = atom<Promise<OrderItem[]>>(async get => {
  try {
    const session = await get(sessionAtom);

    if (session?.id && session.slug) {
      const {payload} = await getSessionOrderItems({
        id: session.id,
        slug: session.slug,
      });

      return payload.orderItems;
    }

    return [];
  } catch (e) {
    return [];
  }
});

export const sessionOrderSchemesAtom = atom<Promise<SessionOrderScheme>>(
  async get => {
    const sessionOrder = await get(sessionOrderAtom);
    const orderItems = await get(sessionOrderItemsAtom);
    const selectedSector = get(selectedSectorAtom);

    const [areasScheme, seatsScheme] = [
      sessionOrder?.scheme?.areas,
      selectedSector
        ? sessionOrder?.scheme?.seats.filter(
            seat => seat.schemeSectorId === selectedSector.id,
          )
        : sessionOrder?.scheme?.seats,
    ];

    const areasSchemeMap = new Map(
      areasScheme?.map(area => [area.schemeArea.htmlId, area]),
    );

    const seatsSchemeMap = new Map(
      seatsScheme?.map(seat => [seat.htmlId, seat]),
    );

    const orderItemsMap = new Map(
      (selectedSector
        ? orderItems.filter(order => order.schemeSectorId === selectedSector.id)
        : orderItems
      )?.map(orderItem => [orderItem.htmlId, orderItem]),
    );

    return {
      seats: seatsSchemeMap,
      areas: areasSchemeMap,
      orderItems: orderItemsMap,
    };
  },
);
