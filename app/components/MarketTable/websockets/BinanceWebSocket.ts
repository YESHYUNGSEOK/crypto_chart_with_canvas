import { drawPrice, drawKimp } from "../utils/drawCanvas";

const binanceWebSocketUrl = "wss://stream.binance.com:9443/ws";

const param: any = {
  id: 1,
  method: "SUBSCRIBE",
};

export function BinanceWebSocket(codes: string[], marketMap: any) {
  param.params = codes;
  const ws = new WebSocket(binanceWebSocketUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify(param));
  };

  ws.onmessage = (event) => {
    const crypto = JSON.parse(event.data);

    if (!crypto.s) return;

    const [symbol, price] = [crypto.s.slice(0, -4), crypto.c];
    const index = marketMap[symbol].index;
    marketMap[symbol].binance = price;

    function draw() {
      drawPrice(
        index,
        marketMap[symbol].binance,
        marketMap[symbol].upbit,
        marketMap.exchangeRate.basePrice,
        "BINANCE"
      );
      drawKimp(
        index,
        marketMap[symbol].upbit,
        marketMap[symbol].binance,
        marketMap.exchangeRate.basePrice
      );
    }
    requestAnimationFrame(draw);
  };

  return ws;
}
