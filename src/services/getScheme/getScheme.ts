import {URLs} from '@atoms/urls';

export const getScheme = async (path: string) => {
  const URLs: URLs | null = await JSON.parse(
    localStorage.getItem('urls') || 'null',
  );

  const response = await fetch(URLs?.apiURL + `/storage/schemes/${path}`);

  return response.text();
};
