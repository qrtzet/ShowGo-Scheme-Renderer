import {atom} from "jotai";
import {sessionAtom} from "@atoms/session";
import {getESBOPricing} from "@services/ESBO";

export const ESBOPricingAtom = atom(async (get) => {
  const session = await get(sessionAtom)

  const ESBOSessionId = session?.outerSessionId

  if(!ESBOSessionId) return []

  const pricing = await getESBOPricing(ESBOSessionId)

  return pricing
})
