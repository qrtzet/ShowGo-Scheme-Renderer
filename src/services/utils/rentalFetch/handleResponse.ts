import {TError} from '@type/http.type';
import {isSuccess} from '../index';

export const handleResponse = async (response: Response) => {
  if (isSuccess(response.status)) {
    return response;
  }

  const res = await response.json();

  const error: TError = {
    status: response?.status,
    statusText: response?.statusText,
    message: response?.statusText,
    response: res,
  };

  console.error(
    `${response?.url} responded with status ${response?.status}, text: ${res?.status}`,
  );

  throw error;
};
