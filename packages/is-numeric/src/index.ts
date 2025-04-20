const isNumeric = (value: unknown) => {
  if (typeof value === 'number') {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  return !isNaN(value as unknown as number) && !isNaN(parseFloat(value));
};

export default isNumeric;
