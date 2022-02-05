export const capitalize = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const exists = (pool, fish) => {
  const index = pool.indexOf(fish);
  if (index > -1) {
    return true;
  }
  return false;
};

export const getRandomVal = (min, max) => {
  return Math.random() * (max - min) + min;
};
