const bithumbWebSocketUrl = "wss://pubwss.bithumb.com/pub/ws";

export function BithumbWebSocket() {
  const ws = new WebSocket(bithumbWebSocketUrl);
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "ticker",
        symbols: ["BTC_KRW", "ETH_KRW"],
        tickTypes: ["30M", "1H", "12H", "24H", "MID"],
      })
    );
  };

  ws.onmessage = (event) => {
    console.log(event.data);
  };

  return ws;
}
