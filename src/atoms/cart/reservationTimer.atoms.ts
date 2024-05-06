import dayjs from 'dayjs';
import {atom} from 'jotai';
import {atomWithReset, RESET} from 'jotai/utils';

import {clearTicketsInCartAtom} from '@atoms/cart';

export const RESERVATION_TIME = 900;

export const reservationTimerAtom = atomWithReset(RESERVATION_TIME);

export const humanReadableReservationTimerFormatAtom = atom(get => {
  const timer = get(reservationTimerAtom);

  return dayjs().startOf('day').second(timer).format('mm:ss');
});

export const reservationTimerIntervalAtom = atom<null | NodeJS.Timer>(null);

export const startReservationTimerAtom = atom(null, (get, set) => {
  const timerInterval = get(reservationTimerIntervalAtom);

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const decrementTimer = async () => {
    set(reservationTimerAtom, prevSeconds => {
      const newSeconds = prevSeconds - 1;

      if (newSeconds === -1) {
        set(clearReservationTimerAtom);
        set(clearTicketsInCartAtom);
        return 0;
      }

      return newSeconds;
    });
  };

  const newInterval = setInterval(decrementTimer, 1000);

  set(reservationTimerIntervalAtom, newInterval);
});

export const restartReservationTimer = atom(null, (get, set) => {
  set(reservationTimerAtom, RESET);
  set(startReservationTimerAtom);
});

export const clearReservationTimerAtom = atom(null, (get, set) => {
  const timer = get(reservationTimerIntervalAtom);

  if (timer) {
    clearInterval(timer);
    set(reservationTimerAtom, RESET);
    set(reservationTimerIntervalAtom, null);
  }
});
