import {priceWithSymbol} from '@utils/const/locale';

export const seatStatus = {
  ordered: 'Место выкуплено',
  booked: 'Место забронировано',
  'not-set-up': 'Цена для этого места не установлена',
};

export const generateSeatText = (element: HTMLElement) => {
  const sector = element.getAttribute('data-sector');
  const row = element.getAttribute('data-row');
  const seat = element.getAttribute('data-seat');
  const status = element.getAttribute('data-status');
  const price = element.getAttribute('data-price');
  const type = element.getAttribute('data-type');
  const count = element.getAttribute('data-count');

  if (status) {
    return seatStatus[status as keyof typeof seatStatus];
  }

  if (type === 'table') {
    return `Сектор: ${sector}, Стол: ${row}, Количество мест: ${count}, ${
      price ? `, Цена: ${priceWithSymbol(+price)}` : ''
    }`;
  }

  return `Сектор: ${sector}, Ряд/Стол: ${row}, Место: ${seat}${
    price ? `, Цена: ${priceWithSymbol(+price)}` : ''
  }`;
};
