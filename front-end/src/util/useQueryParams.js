/*
    This is just a nice custom hook that we can
    use to get all the query parameters from inside
    our components. Don't worry about the details
    unless you're curious :)
*/

import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  const location = useLocation();
  const currentParamsObj = new URLSearchParams(location.search);
  const params = {};
  currentParamsObj
    .toString()
    .split('&')
    .forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });

  return params;
};
