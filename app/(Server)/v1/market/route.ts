import axios from "axios";

const upbitMarketUrl = "https://api.upbit.com/v1/market/all";
const upbitMarketPricesUrl = "https://api.upbit.com/v1/ticker";
const binanceMarketUrl = "https://fapi.binance.com/fapi/v1/premiumIndex";
const exchangeRateUrl =
  "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD";

export async function GET() {
  try {
    const [upbitMarket, binanceMarket, exchangeRate] = await Promise.all([
      axios.get(upbitMarketUrl).then((res) => res.data),
      axios.get(binanceMarketUrl).then((res) => res.data),
      axios.get(exchangeRateUrl).then((res) => res.data),
    ]);

    // 업비트 원화시장 코인 목록
    const upbitKRWMarket: {
      market: string;
      korean_name: string;
      english_name: string;
    }[] = [];
    // 업비트 원화시장 코인 코드 목록 (ex. KRW-BTC, KRW-ETH, ...)
    const upbitKRWMarketCodes: string[] = [];
    const binanceMarketCodes: string[] = [];
    upbitMarket.map((crypto: any) => {
      if (crypto.market.startsWith("KRW-")) {
        upbitKRWMarket.push(crypto);
        upbitKRWMarketCodes.push(crypto.market);
        binanceMarketCodes.push(
          `${crypto.market.slice(4).toLowerCase()}usdt@miniTicker`
        );
      }
    });

    // 업비트 원화시장 코인 현재 가격 목록
    const upbitKRWMarketPrices = await axios
      .get(`${upbitMarketPricesUrl}?markets=${upbitKRWMarketCodes.join(",")}`)
      .then((res) => res.data);

    const marketMap = upbitKRWMarketPrices.reduce((acc: any, crypto: any) => {
      const key = crypto.market.replace("KRW-", "");
      acc[key] = { upbit: crypto.trade_price, binance: null };
      return acc;
    }, {});

    const market = upbitKRWMarket.map((crypto, i) => ({
      ...crypto,
      trade_price: upbitKRWMarketPrices[i].trade_price,
      acc_trade_price: upbitKRWMarketPrices[i].acc_trade_price,
      acc_trade_price_24h: upbitKRWMarketPrices[i].acc_trade_price_24h,
      highest_52_week_price: upbitKRWMarketPrices[i].highest_52_week_price,
      lowest_52_week_price: upbitKRWMarketPrices[i].lowest_52_week_price,
      prev_closing_price: upbitKRWMarketPrices[i].prev_closing_price,
    }));

    // 바이낸스 원화시장 코인 현재 가격을 업비트 원화시장 코인 목록에 추가
    const binanceMarketMap: Record<string, number> = {};
    binanceMarket.map((crypto: any) => {
      if (!crypto.symbol.endsWith("USDT")) return;
      const [symbol] = crypto.symbol.split("USDT");
      binanceMarketMap[symbol] = Number(crypto.indexPrice);
    });
    market.map((crypto: any) => {
      const symbol = crypto.market.replace("KRW-", "");
      if (binanceMarketMap[symbol]) {
        marketMap[symbol].binance = binanceMarketMap[symbol];
        crypto.binance_trade_price = binanceMarketMap[symbol];
      }
    });

    marketMap["exchangeRate"] = exchangeRate[0];

    return Response.json({
      cryptos: market,
      marketMap: marketMap,
      upbitCodes: upbitKRWMarketCodes,
      binanceCodes: binanceMarketCodes,
      binanceMarketMap: binanceMarketMap,
    });
  } catch (e) {
    throw e;
  }
}
