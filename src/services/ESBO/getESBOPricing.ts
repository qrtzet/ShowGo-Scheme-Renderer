import {rentalFetchAuthorized} from "@services/utils";
import {convertKeysToCamelCase} from "@utils/convertKeysToSnakeCase";

export type ESBOPricing = {
  color: string;
  eventId: number;
  eventName: string;
  eventSessionId: number;
  eventSessionName: string;
  id: number;
  palaceName: string;
  price: number;
  tarifName: string;
};

export const getESBOPricing = async (ESBOSessionId: number): Promise<ESBOPricing[]> => {
  const response = await rentalFetchAuthorized(
    `esbo/pricing/${ESBOSessionId}`,
    {
      method: 'GET',
    }
  );

  const responseData = await response.json();

  const data: ESBOPricing[] = convertKeysToCamelCase(responseData.payload)

  return data
    .filter(item => item.price > 0)
    .sort((a, b) => a.price - b.price);
};
