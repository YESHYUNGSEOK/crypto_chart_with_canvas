import { drawPrice, drawKimp } from "../utils/drawCanvas";

const upbitWebSocketUrl = "wss://api.upbit.com/websocket/v1";

const param: any = [
  { ticket: "TICKET-KR-1711549693374" },
  {
    type: "ticker",
    isOnlyRealtime: true,
  },
  { format: "SIMPLE" },
];

export function UpbitWebSocket(codes: string[], market: any) {
  param[1].codes = codes;
  const ws = new WebSocket(upbitWebSocketUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify(param));
  };

  ws.onmessage = (event) => {
    event.data.text().then((data: any) => {
      const marketMap = market.marketMap;
      const crypto = JSON.parse(data);
      const [symbol, price] = [crypto.cd.replace("KRW-", ""), crypto.tp];
      const index = marketMap[symbol].index;
      marketMap[symbol].upbit = price;
      function draw() {
        drawPrice(
          index,
          price,
          price,
          marketMap.exchangeRate.basePrice,
          "UPBIT"
        );
        drawKimp(
          index,
          marketMap[symbol].upbit,
          marketMap[symbol].binance,
          marketMap.exchangeRate.basePrice
        );
      }

      requestAnimationFrame(draw);
    });
  };

  return ws;
}
