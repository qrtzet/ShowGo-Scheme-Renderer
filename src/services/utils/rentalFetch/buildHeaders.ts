import {URLs} from '@atoms/urls/urls.atoms';
import {Data} from '@services/utils/rentalFetch/rentalFetch.types';
import {HttpHeader} from '@type/http.type';

export const buildHeaders = async ({accessToken}: Data) => {
  const urls = (await JSON.parse(
    localStorage.getItem('urls') || 'null',
  )) as URLs | null;

  const headers: HttpHeader = {
    'Country-Code': (urls?.key as 'uz' | 'kg') || 'uz',
  };
  headers.accept = '*/*';
  headers['Content-Type'] = 'application/json';
  headers.Origin = urls?.websiteURL;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (urls?.lang) {
    headers['Accept-Language'] = urls.lang;
  }

  return headers;
};
