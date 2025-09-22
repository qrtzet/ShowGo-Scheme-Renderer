import {TicketInCart, TicketInCartRes} from '@atoms/cart';

export const convertTicketRes = (ticket: TicketInCartRes) => {
  const newTicket: TicketInCart = {
    id: ticket.id,
    price: ticket.price,
    event: ticket.event,
    session: ticket.session,
    title: ticket.title,
    ticket: {
      type: ticket.ticketTypeId ? 'entry' : 'seat',
      id: ticket.ticketSeatId ? ticket?.ticketSeatId : ticket?.ticketTypeId!,
    },
    outerId: ticket?.outerId
  };

  return newTicket;
};
