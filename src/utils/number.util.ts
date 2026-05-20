const DEFAULT_DECIMAL_PLACES = 2;
const SINGLE_DECIMAL_PLACES = 1;
const RATING_PRECISION = 100;
const ROUNDING_MULTIPLIER = 10;

export const formatNumber = (
  input: unknown,
  decimal = DEFAULT_DECIMAL_PLACES
): string => {
  const value = Number(input);

  if (isNaN(value)) {
    return '';
  }

  const fixed = value.toFixed(decimal);
  let [intPart, decimalPart] = fixed.split('.');

  if (!decimalPart || Number(decimalPart) === 0) {
    return intPart;
  }

  if (decimal === SINGLE_DECIMAL_PLACES) {
    return (
      Math.round(value * ROUNDING_MULTIPLIER) / ROUNDING_MULTIPLIER
    ).toString();
  }

  if (decimal === DEFAULT_DECIMAL_PLACES) {
    if (decimalPart[1] === '0') {
      return `${intPart}.${decimalPart[0]}`;
    }
    if (decimalPart[1] === '5') {
      return (
        Math.round(value * ROUNDING_MULTIPLIER) / ROUNDING_MULTIPLIER
      ).toString();
    }
    return `${intPart}.${decimalPart}`;
  }

  return fixed;
};

export const formatRating = (rating: number | string): string => {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;

  const rounded = Math.round(num * RATING_PRECISION) / RATING_PRECISION;

  const fixed = rounded.toFixed(DEFAULT_DECIMAL_PLACES);
  const [intPart, decimalPart] = fixed.split('.');
  if (decimalPart === '00') {
    return rounded.toFixed(SINGLE_DECIMAL_PLACES);
  }
  if (decimalPart[1] === '0') {
    return `${intPart}.${decimalPart[0]}`;
  }
  return fixed;
};
