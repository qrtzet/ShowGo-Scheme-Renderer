import {ticketsInCartAtom} from '@atoms/cart';
import {selectedSeatPriceAtom} from '@atoms/scheme/seatPrices.atoms';
import {sessionOrderAtom, sessionOrderItemsAtom, sessionOrderSchemesAtom} from '@atoms/session';
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
    const orderItemsR = await get(sessionOrderItemsAtom);
    const ticketsInCart = get(ticketsInCartAtom);
    const theme = get(themeAtom);

    const [seatsScheme, areasScheme, orderItems, orderItemsCount] = [
      orderSchemes.seats,
      orderSchemes.areas,
      orderSchemes.orderItems,
      orderSchemes.orderItemsCount,
    ];

    setSchemeColors(svgElement, 'without-color');

    const myOrderedSeatsIDs = ticketsInCart.reduce((acc, currentTicket) => {
      const seatScheme = Array.from(seatsScheme.values()).find(
        item => item.id === currentTicket.ticket.id,
      );
      if (seatScheme) acc.push(seatScheme.htmlId);
      return acc;
    }, [] as string[]);

    const myOrderedSeats = getSpecificSchemeSeats(svgElement, myOrderedSeatsIDs);

    // Получаем все элементы кресел, которые есть в схеме
    const allSeatsIDs = Array.from(seatsScheme.keys());
    const allSeatsElements = getSpecificSchemeSeats(svgElement, allSeatsIDs);

    const orderedSeats: Element[] = [];
    const availableSeats: Element[] = [];

    allSeatsElements.forEach(seatElement => {
      const seatScheme = seatsScheme.get(seatElement.id);
      if (!seatScheme) return;

      const key = seatScheme.schemeSectorId 
        ? `${seatScheme.schemeSectorId}-${seatScheme.htmlId}` 
        : seatScheme.htmlId;

      const isOrdered = orderItems.has(key);
      const isMyOrder = myOrderedSeatsIDs.includes(seatScheme.htmlId);

      if (isMyOrder) {
        // Пропускаем, так как покрасим отдельно через setGroupsColor(myOrderedSeats)
        return;
      }

      if (isOrdered) {
        orderedSeats.push(seatElement);
      } else {
        availableSeats.push(seatElement);
      }
    });

    // Красим свободные места
    availableSeats.forEach(seatElement => {
      const seatScheme = seatsScheme.get(seatElement.id);
      setGroupColor(
        seatElement,
        selectedSeatPrice && selectedSeatPrice.color !== seatScheme?.color ? 'without-color' : 'default',
        'seat',
        seatScheme?.color,
        String(seatScheme?.price),
      );
    });

    // Красим занятые места
    setGroupsColor(
      orderedSeats,
      'disabled',
      'seat',
      selectedSeatPrice ? colors.blur : undefined,
    );

    // Красим мои места (в корзине)
    setGroupsColor(myOrderedSeats, 'default', 'seat', colors.red);

    const sectorElements = svgElement
      ?.querySelector('#sectors')
      ?.querySelectorAll('[id^="sector_"]');

    Array.from(sectorElements || []).forEach(elItem => {
      const existSector = sessionOrder?.scheme?.sectors?.find(item => item.sectorId === elItem.id)
      if (existSector) {
        const allSeatsInSector = sessionOrder?.scheme?.seats?.filter(seat => seat.schemeSectorId === existSector.id) || [];
        
        const hasAvailableSeats = allSeatsInSector.some(seat => {
          const key = seat.schemeSectorId ? `${seat.schemeSectorId}-${seat.htmlId}` : seat.htmlId;
          return !orderItems.has(key);
        });

        if (hasAvailableSeats) {
        setGroupColor(elItem, 'default', 'sector');
          return;
        }
      }

      setGroupColor(elItem, 'disabled', 'sector');
    });

    const areasElements =
      svgElement?.querySelector('#areas')?.querySelectorAll('[id^="area_"]') ||
      [];

    areasElements.forEach((areaElement) => {
      const areaScheme = areasScheme.get(areaElement.id);
      if (!areaScheme) return;

      const soldCount = orderItemsCount.get(areaElement.id) || 0;
      const inCartCount = ticketsInCart.filter(ticket => ticket.ticket.id === areaScheme.id).length;
      
      const leftCount = areaScheme.quantity !== null 
        ? Math.max(0, areaScheme.quantity - soldCount - inCartCount) 
        : null;
        
      const isFull = leftCount === 0;

      if (isFull) {
        setGroupColor(areaElement, 'disabled', 'sector', colors.grey);
        return;
      }

      if (selectedSeatPrice) {
        setGroupColor(
          areaElement,
          areaScheme.color === selectedSeatPrice.color ? 'default' : 'without-color',
          'sector',
          areaScheme.color,
        );
        return;
      }

      setGroupColor(areaElement, 'default', 'sector', areaScheme.color);
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
