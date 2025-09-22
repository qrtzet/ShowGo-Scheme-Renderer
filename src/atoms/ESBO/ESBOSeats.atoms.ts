import {atom} from "jotai";
import {sessionAtom} from "@atoms/session";
import {ESBOSeat, getESBOSeats} from "@services/ESBO";
import {ticketsInCartAtom} from "@atoms/cart";
import {refetchableAtom} from "@atoms/utils/refetchableAtom";

export const occupiedSeatStatusIds = [2, 3, 7];


export const ESBOSeatsAtom = refetchableAtom(async (get) => {
  const session = await get(sessionAtom)

  const ESBOSessionId = session?.outerSessionId

  if(!ESBOSessionId) return []

  const seats = await getESBOSeats(ESBOSessionId)

  return seats
})

export const ESBOOccupiedSeatsAtom = atom(async get => {
  const cart = get(ticketsInCartAtom);
  const seats = await get(ESBOSeatsAtom);

  const orderedSeats =
    cart.reduce((acc, currentTicket) => {
      const seatData = seats.find(
        seat => seat.outerId === currentTicket.outerId,
      );

      if (seatData) {
        acc.push(seatData);
      }

      return acc;
    }, [] as ESBOSeat[]) || [];

  const orderedSeatsOuterIds = orderedSeats?.map(seat => seat.outerId);

  const occupiedSeats = seats.filter(
    seat =>
      occupiedSeatStatusIds.includes(seat.ticketStatusId) &&
      !orderedSeatsOuterIds.includes(seat.outerId),
  );

  return {occupiedSeats, orderedSeats, orderedSeatsOuterIds};
});

export const ESBOAvailableSeatsAtom = atom(async get => {
  const seats = await get(ESBOSeatsAtom);

  const availableSeats = seats.filter(
    seat => !occupiedSeatStatusIds.includes(seat.ticketStatusId),
  );

  return {availableSeats};
});
