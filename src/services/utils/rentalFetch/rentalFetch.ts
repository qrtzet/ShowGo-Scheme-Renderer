import {URLs} from '@atoms/urls/urls.atoms';
import {buildBody} from './buildBody';
import {buildHeaders} from './buildHeaders';
import {buildQueryParams} from './buildQueryParams';
import {handleResponse} from './handleResponse';
import {Data} from './rentalFetch.types';

export const rentalFetch = async (
  path: string,
  data: Data,
  withVersion = true,
) => {
  const queryParams = buildQueryParams(data);
  const urls = JSON.parse(
    localStorage.getItem('urls') || 'null',
  ) as URLs | null;

  const url = `${urls?.apiURL + (withVersion ? '/v1/' : '')}${path}${queryParams}`;

  const response = await fetch(url, {
    method: data.method,
    headers: await buildHeaders(data),
    body: buildBody(data),
    signal: data.signal,
  });

  return await handleResponse(response);
};
