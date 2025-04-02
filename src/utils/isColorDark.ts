export const isColorDark = (color: string) => {
  function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return {r, g, b};
  }

  function calculateRelativeLuminance(r: number, g: number, b: number) {
    const rsRGB = r / 255.0;
    const gsRGB = g / 255.0;
    const bsRGB = b / 255.0;

    const rLinear =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  let rgb;
  if (color.startsWith('#')) {
    rgb = hexToRgb(color);
  } else if (color.startsWith('rgb')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      rgb = {r, g, b};
    }
  }

  if (rgb) {
    const L = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);
    return L <= 0.5;
  }

  return false;
};
