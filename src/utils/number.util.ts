export const formatNumber = (input: unknown, decimal = 2): string => {
  const value = Number(input);

  if (isNaN(value)) {
    return '';
  }

  const fixed = value.toFixed(decimal);
  let [intPart, decimalPart] = fixed.split('.');

  if (!decimalPart || Number(decimalPart) === 0) {
    return intPart;
  }

  if (decimal === 1) {
    return (Math.round(value * 10) / 10).toString();
  }

  if (decimal === 2) {
    if (decimalPart[1] === '0') {
      return `${intPart}.${decimalPart[0]}`;
    }
    if (decimalPart[1] === '5') {
      return (Math.round(value * 10) / 10).toString();
    }
    return `${intPart}.${decimalPart}`;
  }

  return fixed;
};

export const formatRating = (rating: number | string): string => {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;

  const rounded = Math.round(num * 100) / 100;

  let result = rounded.toFixed(2);

  if (result.endsWith('00')) {
    result = rounded.toFixed(1);
  } else if (result.endsWith('0')) {
    result = result.slice(0, -1);
  }

  return result;
};
