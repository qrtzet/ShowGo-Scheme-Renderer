import {TError} from '@type/http.type';
import {convertTicketRes} from '@utils/convertTicketRes';
import {atom} from 'jotai';
import {atomWithImmer} from 'jotai-immer';

import {setSchemeColorsAtom, svgContainerAtom} from '@atoms/scheme';
import {addTicket, getTickets, removeTicket} from '@services/cart';

import {AddTicketToCartData, TicketInCart} from './cart.types';
import {
  clearReservationTimerAtom,
  reservationTimerAtom,
  restartReservationTimer,
  startReservationTimerAtom,
} from './reservationTimer.atoms';
import toast from "react-hot-toast";

let isFetching = false;

export const ticketsInCartAtom = atomWithImmer<TicketInCart[]>([]);

export const addTicketToCartAtom = atom(
  null,
  async (get, set, ticketData: AddTicketToCartData) => {
    if (isFetching) {
      return;
    }

    isFetching = true;

    try {
      const ticketsInCart = get(ticketsInCartAtom);
      const notFreeTicket = ticketsInCart.find(ticket => !ticket.event.isFree);

      if (
        (ticketData.isFree && notFreeTicket) ||
        (!notFreeTicket && notFreeTicket !== undefined && !ticketData.isFree)
      ) {
        toast.error(
          'Нельзя добавить бесплатные билеты вместе с платными. Оформите их отдельно',
        );
        return;
      }

      const {payload} = await addTicket(ticketData);

      if (payload?.id) {
        set(restartReservationTimer);
        set(ticketsInCartAtom, draft => {
          draft.push(convertTicketRes(payload));
        });

        const svgContainer = get(svgContainerAtom);

        if (svgContainer) {
          await set(setSchemeColorsAtom, svgContainer);
        }
      }
    } catch (e) {
      toast.error(
        (e as TError)?.status === 401
          ? 'У вас проблемы с авторизацией, попробуйте выйти и авторизоваться снова'
          : 'Нехватка билетов',

      );
    } finally {
      isFetching = false;
    }
  },
);

export const removeTicketFromCartAtom = atom(
  null,
  async (get, set, seatId: number) => {
    try {
      const removedTicket = get(ticketsInCartAtom).find(
        ticket => ticket.ticket.id === seatId,
      );

      if (removedTicket) {
        await removeTicket(removedTicket.id);

        set(ticketsInCartAtom, draft => {
          const newData = draft.filter(
            ticket => removedTicket.id !== ticket.id,
          );

          if (!newData.length) {
            set(clearReservationTimerAtom);
          }

          return newData;
        });
      }

      const svgContainer = get(svgContainerAtom);

      if (svgContainer) {
        await set(setSchemeColorsAtom, svgContainer);
      }
    } finally {
    }
  },
);

export const getTicketsInCartAtom = atom(null, async (_, set) => {
  try {
    const {basket, timer} = await getTickets();

    if (basket?.length) {
      set(reservationTimerAtom, timer);
      set(startReservationTimerAtom);
      set(ticketsInCartAtom, basket.map(convertTicketRes));
      return;
    }

    await set(clearTicketsInCartAtom);
  } catch (e) {}
});

export const clearTicketsInCartAtom = atom(null, async (get, set) => {
  try {
    set(ticketsInCartAtom, []);
    set(clearReservationTimerAtom);

    const svgContainer = get(svgContainerAtom);

    if (svgContainer) {
      await set(setSchemeColorsAtom, svgContainer);
    }
  } catch (e) {}
});
