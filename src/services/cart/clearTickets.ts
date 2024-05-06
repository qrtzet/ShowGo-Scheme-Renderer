import {rentalFetchAuthorized} from '@services/utils';

export const clearTickets = async () => {
  await rentalFetchAuthorized('basket/clear', {
    method: 'POST',
  });
};
