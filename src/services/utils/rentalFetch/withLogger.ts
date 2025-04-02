import {URLs} from '@atoms/urls/urls.atoms';
import {buildQueryParams} from './buildQueryParams';
import {Data, RequestFunc} from './rentalFetch.types';

export const withLogger = async (
  func: RequestFunc,
  path: string,
  data: Data,
  withVersion?: boolean,
) => {
  const URLs = JSON.parse(
    localStorage.getItem('urls') || 'null',
  ) as URLs | null;
  let isFinished = false;
  const queryParams = buildQueryParams(data);

  const url = `${URLs?.apiURL}/v1/${path}${queryParams}`;

  console.info(url);

  data.signal?.addEventListener('abort', () => {
    if (isFinished) {
      return;
    }

    console.info('<<Aborted>>', url);
  });

  const result = await func(path, data, withVersion);
  isFinished = true;
  return result;
};
