import {ticketsInCartAtom} from '@atoms/cart';
import {selectedSeatPriceAtom} from '@atoms/scheme/seatPrices.atoms';
import {sessionOrderAtom, sessionOrderSchemesAtom} from '@atoms/session';
import {themeAtom} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {getSpecificSchemeSeats} from '@utils/getSpecificSchemeSeats';
import {
  setGroupColor,
  setGroupsColor,
  setSchemeColors,
} from '@utils/setSchemeColors';
import {atom} from 'jotai';

export const svgContainerAtom = atom<HTMLDivElement | null>(null);

export const isSchemeLoadingAtom = atom<boolean>(false);

export const setSchemeColorsAtom = atom(
  null,
  async (get, set, svgElement: HTMLDivElement) => {
    set(isSchemeLoadingAtom, true);
    set(svgContainerAtom, svgElement);

    const orderSchemes = await get(sessionOrderSchemesAtom);
    const sessionOrder = await get(sessionOrderAtom);
    const selectedSeatPrice = get(selectedSeatPriceAtom);
    const ticketsInCart = get(ticketsInCartAtom);
    const theme = get(themeAtom);

    const [seatsScheme, areasScheme, orderItems] = [
      orderSchemes.seats,
      orderSchemes.areas,
      orderSchemes.orderItems,
    ];

    setSchemeColors(svgElement, 'without-color');

    const orderedSeatsIDs = Array.from(orderItems.keys());
    const orderedSeats = getSpecificSchemeSeats(svgElement, orderedSeatsIDs);
    const myOrderedSeatsIDs =
      ticketsInCart.reduce((acc, currentTicket) => {
        const seatScheme = Array.from(seatsScheme.values()).find(
          item => item.id === currentTicket.ticket.id,
        );

        if (seatScheme) {
          acc.push(seatScheme.htmlId);
        }

        return acc;
      }, [] as string[]) || [];

    const myOrderedSeats = getSpecificSchemeSeats(
      svgElement,
      myOrderedSeatsIDs,
    );

    const seatsIDs = Array.from(seatsScheme.keys());

    const seatsElements = getSpecificSchemeSeats(
      svgElement,
      seatsIDs.filter(id => !orderedSeatsIDs.includes(id)),
    );

    seatsElements.forEach(seatElement => {
      const seatScheme = seatsScheme.get(seatElement.id);

      if (selectedSeatPrice) {
        setGroupColor(
          seatElement,
          selectedSeatPrice.color === seatScheme?.color
            ? 'default'
            : 'without-color',
          'seat',
          seatScheme?.color,
          String(seatScheme?.price),
        );
        return;
      }

      setGroupColor(
        seatElement,
        'default',
        'seat',
        seatScheme?.color,
        String(seatScheme?.price),
      );
    });

    setGroupsColor(
      orderedSeats,
      'disabled',
      'seat',
      selectedSeatPrice ? colors.blur : undefined,
    );

    setGroupsColor(myOrderedSeats, 'default', 'seat', colors.red);

    const sectorElements = svgElement
      ?.querySelector('#sectors')
      ?.querySelectorAll('[id^="sector_"]');

    Array.from(sectorElements || []).forEach(elItem => {
      const existSector = sessionOrder?.scheme?.sectors?.find(item => item.sectorId === elItem.id)
      const existSeat = sessionOrder?.scheme?.seats.find(seat =>  seat.schemeSectorId === existSector?.id)

      if (
        existSector && existSeat
      ) {
        setGroupColor(elItem, 'default', 'sector');
        return;
      }

      setGroupColor(elItem, 'disabled', 'sector');
    });

    const areasElements =
      svgElement?.querySelector('#areas')?.querySelectorAll('[id^="area_"]') ||
      [];

    areasElements.forEach((areaElement, index) => {
      const areaScheme = areasScheme.get(areaElement.id);

      if (selectedSeatPrice) {
        setGroupColor(
          areaElement,
          areaScheme?.color === selectedSeatPrice.color
            ? 'default'
            : 'without-color',
          'seat',
          areaScheme?.color,
        );
        return;
      }

      setGroupColor(areaElement, 'default', 'seat', areaScheme?.color);
    });

    const rowsGroup = svgElement.querySelector('#rows');

    if (rowsGroup) {
      const elements = rowsGroup.querySelectorAll('*');

      elements.forEach(element => {
        if (element.tagName === 'path') {
          element.setAttribute('stroke', theme === 'dark' ? '#fff' : '#000');
        } else if (element.tagName === 'text' || element.tagName === 'tspan') {
          element.setAttribute('fill', theme === 'dark' ? '#fff' : '#000');
        }
      });
    }

    set(isSchemeLoadingAtom, false);
  },
);
