import {atom} from "jotai";
import {ESBOAvailableSeatsAtom, ESBOOccupiedSeatsAtom, ESBOSeatsAtom} from "@atoms/ESBO/ESBOSeats.atoms";
import {addTicketToCartAtom, removeTicketFromCartAtom, restartReservationTimer, ticketsInCartAtom} from "@atoms/cart";
import {sessionAtom} from "@atoms/session";
import {getESBOSeatKey} from "@utils/getESBOSeatKey";
import toast from "react-hot-toast";

export const ESBOSeatClickAtom = atom(
  null,
  async (get, set, seatKey: string) => {
    try {
      const {availableSeats} = await get(ESBOAvailableSeatsAtom);
      const {orderedSeats} = await get(ESBOOccupiedSeatsAtom);
      const basket = get(ticketsInCartAtom);
      const session = await get(sessionAtom);
      const selectedSessionId = session?.id;
      const selectedEventId = session?.event?.id;

      const seatData =
        availableSeats.find(seat => getESBOSeatKey(seat) === seatKey) ||
        orderedSeats.find(seat => getESBOSeatKey(seat) === seatKey);

      if (!selectedEventId || !selectedSessionId || !seatData) {
        return;
      }

      const isSeatInBasket = basket.find(
        item => item.outerId === seatData?.outerId,
      );

      if (isSeatInBasket) {
        set(ESBOSeatsAtom)

        await set(removeTicketFromCartAtom, {seatId: seatData?.outerId, isESBO: true});
      } else {

        await set(addTicketToCartAtom, {
          ticket: {
            type: 'seat',
            id: seatData?.outerId,
          },
          isFree: session?.event?.isFree,
          eventId: selectedEventId,
          sessionId: selectedSessionId,
          isESBO: true
        });
      }

      set(restartReservationTimer);
    } catch (e) {
      toast.error('Что то пошло не так !');
    }
  },
);
