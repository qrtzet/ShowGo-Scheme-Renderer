import {rentalFetchAuthorized} from "@services/utils";
import {convertKeysToCamelCase} from "@utils/convertKeysToSnakeCase";

export type ESBOSeat = {
  id: number;
  mySessionId: number;
  outerId: number;
  palaceHallId: number;
  rowNumber: string;
  seatId: number;
  seatNumber: string;
  sectorId: number;
  sectorName: string;
  sessionId: number;
  tarifId: number;
  tarifName: string;
  ticketStatusId: number;
  ticketStatusName: string;
};

export const getESBOSeats = async (outerSessionId: number): Promise<ESBOSeat[]> => {
  const response = await rentalFetchAuthorized(
    `esbo/seat/tickets-by-session/${outerSessionId}`, {
      method: 'GET',
    }
  );

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData.payload);
}
