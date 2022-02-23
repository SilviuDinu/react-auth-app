import moment from 'moment';

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

export const getFilteredItems = (items, filters, user) => {
  if (!filters) {
    return items;
  }

  const { includeShared = true, paidByMeOnly = false, category = 'All' } = filters || {};

  if (includeShared && !paidByMeOnly && category === 'All') {
    return items;
  }

  let filteredItems;

  if (!includeShared) {
    filteredItems = items.filter((item) => !item.sharedBy);
  }

  if (paidByMeOnly) {
    filteredItems = (filteredItems || items).filter((item) => item.who === user?.userName);
  }

  if (category !== 'All') {
    filteredItems = (filteredItems || items).filter((item) => item.category === category);
  }

  return filteredItems;
};

export const getTotalThisMonth = (items, filters, user) => {
  const total = getFilteredItems(items, filters, user).reduce((acm, item) => {
    const now = moment();
    if (now.isSame(moment(item.date), 'month')) {
      return (acm += Number(parseFloat(item.amount).toFixed(2)));
    }
    return acm;
  }, 0);

  return total;
};
