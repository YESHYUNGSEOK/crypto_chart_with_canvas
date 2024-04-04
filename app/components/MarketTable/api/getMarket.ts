import axios from "axios";

const getMarketUrl = "/v1/market";
export async function getMarket() {
  try {
    const response = await axios.get(getMarketUrl);
    return response.data;
  } catch (e) {
    throw e;
  }
}
