import toast from 'react-hot-toast';

/**
 * Пока место добавляется в корзину, повторные тапы по схеме не отправляем.
 *
 * Схема живёт в вебвью на телефоне: по месту легко попасть дважды, а каждый
 * тап — это запрос, который либо займёт ещё одно место, либо снимет только
 * что занятое. Замок синхронный, то есть срабатывает в самом обработчике,
 * до любой перерисовки.
 *
 * Срок на случай, если запрос не вернётся вовсе: иначе схема осталась бы
 * заблокированной до перезагрузки.
 */
const LOCK_TIMEOUT = 20_000;

let lockedUntil = 0;

export const lockPlaceClick = () => {
  if (Date.now() < lockedUntil) {
    toast('Подождите, добавляем место', {id: 'place-click-lock'});

    return false;
  }

  lockedUntil = Date.now() + LOCK_TIMEOUT;

  return true;
};

export const unlockPlaceClick = () => {
  lockedUntil = 0;
};
