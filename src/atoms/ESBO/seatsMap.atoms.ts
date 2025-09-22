import {atom} from 'jotai';

import {getESBOSeatKey} from "@utils/getESBOSeatKey";

import {ESBOAvailableSeatsAtom, ESBOOccupiedSeatsAtom} from "./ESBOSeats.atoms";

export const OSOccupiedSeatsMapAtom = atom(async get => {
  const {occupiedSeats, orderedSeats} = await get(ESBOOccupiedSeatsAtom);

  const occupiedSeatsMap = new Map(
    occupiedSeats.map(seat => [getESBOSeatKey(seat), seat]),
  );
  const orderedSeatsMap = new Map(
    orderedSeats.map(seat => [getESBOSeatKey(seat), seat]),
  );

  return {occupiedSeatsMap, orderedSeatsMap};
});

export const OSAvailableSeatsMapAtom = atom(async get => {
  const {availableSeats} = await get(ESBOAvailableSeatsAtom);

  const availableSeatsMap = new Map(
    availableSeats.map(seat => [getESBOSeatKey(seat), seat]),
  );

  return {availableSeatsMap};
});
