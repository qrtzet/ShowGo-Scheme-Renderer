export const priceWithSymbol = (price: string | number = 0) =>
  `${price.toLocaleString().replace(/,/g, ' ')}`;
