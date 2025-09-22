import {ESBOSeat} from '@services/ESBO';

export const getESBOSeatKey = (seat: ESBOSeat) =>
  `${seat.seatNumber}-${seat.rowNumber}-${seat.sectorName}`;

export const getESBOSeatElementKey = (seatElement: Element) => {
  const seat = seatElement.getAttribute('data-seat');
  const row = seatElement.getAttribute('data-row');
  const sector = seatElement.getAttribute('data-sector');

  if (!seat || !row || !sector) return null;

  return `${seat}-${row}-${sector}`;
};
