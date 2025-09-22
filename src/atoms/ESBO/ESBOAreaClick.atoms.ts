import {atom} from 'jotai';
import {sessionAtom} from "@atoms/session";
import {isSchemeLoadingAtom} from "@atoms/scheme";
import {addTicketToCartAtom, AddTicketToCartData} from "@atoms/cart";


export const ESBOAreaClickAtom = atom(
  null,
  async (get, set, sectorId: string) => {
    try {
      const session = await get(sessionAtom);
      const selectedSessionId = session?.id;
      const selectedEventId = session?.event?.id;

      if (!selectedEventId || !selectedSessionId) {
        return;
      }
      set(isSchemeLoadingAtom, true);

      const ticketData: AddTicketToCartData = {
        eventId: selectedEventId,
        sessionId: selectedSessionId,
        ticket: {
          id: Number(sectorId),
          type: 'ESBO-area'
        }
      };

      await set(addTicketToCartAtom, ticketData);
    } finally {
      set(isSchemeLoadingAtom, false);
    }
  },
);
