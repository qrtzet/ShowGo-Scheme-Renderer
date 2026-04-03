import {atom} from "jotai";
import {isSchemeLoadingAtom, svgContainerAtom} from "@atoms/scheme";
import { ESBOPricingAtom } from "./ESBOPricing.atoms";
import {OSAvailableSeatsMapAtom, OSOccupiedSeatsMapAtom} from "@atoms/ESBO";
import {getSpecificOSSchemeSeats} from "@utils/getSpecificSchemeSeats";
import {getESBOSeatElementKey} from "@utils/getESBOSeatKey";
import {setGroupColor, setGroupsColor} from "@utils/setSchemeColors";
import {colors} from "@utils/const/colors";
import {ESBOSeatsAtom, occupiedSeatStatusIds} from "@atoms/ESBO/ESBOSeats.atoms";
import {sessionOrderAtom} from "@atoms/session";

export const setESBOSeatsAtom = atom(null, async (get, set, svgElement: HTMLDivElement) => {
  set(isSchemeLoadingAtom, true);
  set(svgContainerAtom, svgElement);

  const pricing = await get(ESBOPricingAtom);

  const {occupiedSeatsMap, orderedSeatsMap} = await get(
    OSOccupiedSeatsMapAtom,
  );
  const {availableSeatsMap} = await get(OSAvailableSeatsMapAtom);
  const sessionOrder = await get(sessionOrderAtom);
  const ESBOSeats = await get(ESBOSeatsAtom);


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

  const sectorElements = svgElement?.querySelectorAll('[id^="sector_"]');
  const areasElements = svgElement?.querySelectorAll('[id^="area_"]');
  const allClickableElements = [...Array.from(sectorElements || []), ...Array.from(areasElements || [])];

  allClickableElements.forEach(elItem => {
    const existSector = sessionOrder?.scheme?.sectors?.find(item => item.sectorId === elItem.id);
    const isArea = elItem.id.startsWith('area_');
    const sectorNameStr = elItem.getAttribute('data-sector');
    const sectorIdNum = existSector ? existSector.id : Number(sectorNameStr);

    const sectorSeats = ESBOSeats.filter(
      seat => seat.sectorName === sectorNameStr || seat.sectorId === Number(sectorNameStr) || seat.sectorId === sectorIdNum
    );

    const hasAnySeats = sectorSeats.length > 0;
    const hasAvailableSeats = sectorSeats.some(
      seat => !occupiedSeatStatusIds.includes(seat.ticketStatusId)
    );

    if (hasAnySeats && hasAvailableSeats) {
      setGroupColor(
        elItem,
        'default',
        isArea ? 'seat' : 'sector',
        isArea ? colors['area-color'] : colors['red']
      );
    } else {
      setGroupColor(elItem, 'disabled', isArea ? 'seat' : 'sector', colors.grey);
    }
  });

  set(isSchemeLoadingAtom, false);

})
