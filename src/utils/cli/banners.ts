const defaultBanner = 'React.js - The library for web and native user interfaces';

/**
 * Generates a gradient banner string with ANSI color codes.
 */
const gradientBanner = (() => {
  const startColor = [97, 218, 251]; // #61dafb RGB
  const endColor = [30, 144, 255]; // #1e90ff RGB
  const length = defaultBanner.length;
  let result = '';

  for (let i = 0; i < length; i++) {
    const r = Math.round(startColor[0] + ((endColor[0] - startColor[0]) * i) / (length - 1));
    const g = Math.round(startColor[1] + ((endColor[1] - startColor[1]) * i) / (length - 1));
    const b = Math.round(startColor[2] + ((endColor[2] - startColor[2]) * i) / (length - 1));

    result += `\x1B[38;2;${r};${g};${b}m${defaultBanner[i]}\x1B[39m`;
  }

  return result;
})();

export { defaultBanner, gradientBanner };
