import {Theme} from '@atoms/theme';
import {colors} from '@utils/const/colors';
import {getTextColor} from '@utils/getTextColor';
import {isColorDark} from '@utils/isColorDark';

export type SetSchemeColorsType =
  | 'without-color'
  | 'default'
  | 'disabled'
  | 'selected'
  | 'booked';

export const setTextsColor = (
  text: SVGElement,
  type: SetSchemeColorsType,
  color?: string,
) => {
  const theme = JSON.parse(localStorage.getItem('theme') || 'light');

  text.style.fill =
    type === 'default'
      ? color || text.style.fill
      : getTextColor(theme as Theme);
  text.style.cursor = type === 'disabled' ? 'default' : 'pointer';

  if (type === 'disabled') {
    text.style.pointerEvents = 'none';
    return;
  }
  text.style.pointerEvents = 'auto';
};

export const setGroupColor = (
  group: Element,
  type: SetSchemeColorsType,
  tag: 'seat' | 'area' | 'sector',
  boxColor?: string,
  price?: string,
) => {
  const elements = group.querySelectorAll('.box');
  const text = group.querySelector('.text');

  group.setAttribute('data-color', boxColor || '');
  group.setAttribute('data-price', price || '');

  if (text instanceof SVGElement) {
    setTextsColor(
      text,
      type,
      boxColor && isColorDark(boxColor) ? colors.white : colors.black,
    );
  }

  elements.forEach(element => {
    if (element instanceof SVGElement) {
      if (type === 'selected') {
        element.style.fill = colors['extra-blur'];
        element.style.cursor = 'pointer';
        return;
      }

      if (type === 'disabled' || type === 'booked') {
        element.style.fill = boxColor || colors.blur;
        element.style.stroke = colors.grey;
        element.style.cursor = 'default';
        element.style.pointerEvents = 'auto';

        if (type === 'booked') {
          element.style.strokeWidth = '4';
          group.classList.remove('seat-group');
        }

        group.setAttribute(
          'data-status',
          type === 'disabled' ? 'ordered' : 'booked',
        );

        group.classList.remove('seat-group');
        return;
      }

      if (type === 'default') {
        element.style.fill = boxColor || '';
        element.style.cursor = 'pointer';
        element.style.stroke = boxColor || colors.grey;
        element.style.pointerEvents = 'auto';
        group.removeAttribute('data-status');

        return;
      }

      element.style.fill = colors.grey;
      element.style.cursor = 'pointer';
      element.style.stroke = colors.grey;
      element.style.pointerEvents = 'auto';
      group.setAttribute('data-status', 'ordered');
      group.setAttribute('data-tooltip-id', 'seat-tooltip');
    }
  });

  if (tag === 'seat' && group instanceof SVGElement) {
    if (group.id.startsWith('seat_')) {
      group.setAttribute('data-tooltip-id', 'seat-tooltip');
    }

    if (
      group.id.startsWith('seat_') &&
      !group.classList.contains('seat-group') &&
      !['disabled', 'booked'].includes(type)
    ) {
      group.classList.add('seat-group');
    }
  }
};

export const setGroupsColor = (
  groups: Element[],
  type: SetSchemeColorsType,
  tag: 'seat' | 'area',
  boxColor?: string,
) => {
  groups.forEach(group => {
    setGroupColor(group, type, tag, boxColor);
  });
};

export const setSchemeColors = (
  svgElement: Element,
  type: SetSchemeColorsType = 'default',
) => {
  const seatsGroups = Array.from(
    svgElement.querySelector('#seats')?.querySelectorAll('[id^="seat_"]') || [],
  );
  const areasGroups = Array.from(
    svgElement.querySelector('#areas')?.querySelectorAll('[id^="area_"]') || [],
  );
  const sectorsGroups = Array.from(
    svgElement.querySelector('#sectors')?.querySelectorAll('[id^="sector_"]') ||
      [],
  );

  if (sectorsGroups) {
    setGroupsColor(sectorsGroups, type, 'area', colors['red']);
  }

  if (seatsGroups) {
    setGroupsColor(seatsGroups, type, 'seat', colors['seat-color']);
  }
  if (areasGroups) {
    setGroupsColor(areasGroups, type, 'area', colors['area-color']);
  }
};
