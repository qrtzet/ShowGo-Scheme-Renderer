import {atom} from "jotai";
import {isSchemeLoadingAtom, svgContainerAtom} from "@atoms/scheme";
import { ESBOPricingAtom } from "./ESBOPricing.atoms";
import {OSAvailableSeatsMapAtom, OSOccupiedSeatsMapAtom} from "@atoms/ESBO";
import {getSpecificOSSchemeSeats} from "@utils/getSpecificSchemeSeats";
import {getESBOSeatElementKey} from "@utils/getESBOSeatKey";
import {setGroupColor, setGroupsColor} from "@utils/setSchemeColors";
import {colors} from "@utils/const/colors";

export const setESBOSeatsAtom = atom(null, async (get, set, svgElement: HTMLDivElement) => {
  set(isSchemeLoadingAtom, true);
  set(svgContainerAtom, svgElement);

  const pricing = await get(ESBOPricingAtom);

  const {occupiedSeatsMap, orderedSeatsMap} = await get(
    OSOccupiedSeatsMapAtom,
  );
  const {availableSeatsMap} = await get(OSAvailableSeatsMapAtom);


  const availableSeatsElement = getSpecificOSSchemeSeats(
    svgElement,
    Array.from(availableSeatsMap.keys()),
  );

  availableSeatsElement.forEach(element => {
    const elementKey = getESBOSeatElementKey(element);

    const seatData = availableSeatsMap.get(elementKey!);

    const seatPricing = pricing.find(
      price => price.tarifName === seatData?.tarifName,
    );

    if (seatData && seatPricing && seatPricing.color) {
      setGroupColor(
        element,
        'default',
        'seat',
        seatPricing.color,
        String(seatPricing.price),
      );
      return;
    }

    setGroupColor(element, 'disabled', 'seat', colors.grey);
  });

  const occupiedSeatsElement = getSpecificOSSchemeSeats(
    svgElement,
    Array.from(occupiedSeatsMap.keys()),
  );
  setGroupsColor(occupiedSeatsElement, 'disabled', 'seat', colors.grey);

  const orderedSeatsElement = getSpecificOSSchemeSeats(
    svgElement,
    Array.from(orderedSeatsMap.keys()),
  );
  setGroupsColor(orderedSeatsElement, 'default', 'seat', colors.red);

  set(isSchemeLoadingAtom, false);

})
