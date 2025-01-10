import {atom} from 'jotai';

import {
  sessionOrderAtom,
  sessionOrderSchemesAtom,
} from '@atoms/session/sessionOrder.atoms';

export type SeatPrice = {
  color: string;
  price: number;
};

export const selectedSeatPriceAtom = atom<SeatPrice | null>(null);

export const seatPricesAtoms = atom(async (get): Promise<SeatPrice[]> => {
  const sessionOrder = await get(sessionOrderAtom);
  const sessionOrderScheme = await get(sessionOrderSchemesAtom);

  if (sessionOrder?.scheme) {
    const uniqueColors = new Set<string>();

    const areasWithPrices = sessionOrder.scheme.areas.map(area => {
      if (!uniqueColors.has(area.color)) {
        uniqueColors.add(area.color);

        return {color: area.color, price: area.price};
      }

      return null;
    });

    const seatsWithPrices = sessionOrder.scheme.seats.map(
      (seat): SeatPrice | null => {
        const isEnabled = !sessionOrder.scheme?.sectors?.length
          ? !sessionOrderScheme?.orderItems?.has(seat.htmlId)
          : true;

        if (!uniqueColors.has(seat.color) && isEnabled) {
          uniqueColors.add(seat.color);

          return {color: seat.color, price: seat.price};
        }

        return null;
      },
    );

    const allWithPrices = areasWithPrices
      .concat(seatsWithPrices)
      .filter(Boolean) as SeatPrice[];

    return allWithPrices.sort((a, b) => a.price - b.price);
  }

  return [];
});
