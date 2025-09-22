export type AddTicketToCartTicketType = 'entry' | 'seat' | 'area' | 'ESBO-area';

export type AddTicketToCartTicket = {
  type: AddTicketToCartTicketType;
  id: number;
};

export type AddTicketToCartData = {
  eventId: number;
  sessionId: number;
  ticket: AddTicketToCartTicket;
  isFree?: boolean;
  isESBO?: boolean
};

export type TicketInCartEvent = {
  id: number;
  title: string;
  isFree?: boolean;
};

export type TicketInCartSession = {
  id: number;
  dateTime: string;
};

export type TicketInCart = {
  id: number;
  event: TicketInCartEvent;
  price: number;
  session: TicketInCartSession;
  ticket: AddTicketToCartTicket;
  /**
   * @type title
   * @example 'Сектор: E, Ряд: 4, Место: 32'
   */
  title: string;
  outerId?: number;
};

export type TicketInCartRes = Omit<TicketInCart, 'ticket'> & {
  ticketSeatId: number | null;
  ticketTypeId: null | number;
};
