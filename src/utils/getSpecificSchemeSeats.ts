export const getSpecificSchemeSeats = (svgElement: Element, ids: string[]) => {
  const selectedSeats = svgElement.querySelectorAll('[id^="seat_"]');

  const specificSeats = Array.from(selectedSeats).filter(element => {
    const id = element.id;
    return ids.includes(id);
  });

  return specificSeats;
};

export const getAreasByTitles = (svgElement: Element, titles: string[]) => {
  const selectedAreas = svgElement.querySelectorAll('[id^="area_"]');

  const areas = Array.from(selectedAreas).filter(element => {
    if (element instanceof SVGElement) {
      const title = element.dataset.title;
      return title && titles.includes(title);
    }
  });

  return areas;
};
