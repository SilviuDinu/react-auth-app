import moment from 'moment';

export const hasUrlExpired = (time, duration = 24, metric = 'hours') => {
  return !(moment().diff(time, metric) < duration);
};
