"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { getMarket } from "@/app/components/MarketTable/api/getMarket";
import { UpbitWebSocket } from "@/app/components/MarketTable/websockets/UpbitWebSocket";
import { BinanceWebSocket } from "@/app/components/MarketTable/websockets/\bBinanceWebSocket";
import { MarketTableItem } from "@/app/components/MarketTable/MarketTableItem";
import { drawRow } from "./utils/drawTable";
import { BithumbWebSocket } from "./websockets/BithumbWebSocket";

export default function MarketTable() {
  const { data: market, isLoading } = useQuery({
    queryKey: ["market"],
    queryFn: getMarket,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!market) return;
    const orderByKimp = setInterval(() => {
      market.cryptos.sort((a: any, b: any) => {
        const keyA = a.market.replace("KRW-", "");
        const keyB = b.market.replace("KRW-", "");

        const upbitPriceA = market.marketMap[keyA].upbit;
        const binancePriceA =
          market.marketMap[keyA].binance *
          market.marketMap.exchangeRate.basePrice;

        const diffA = ((upbitPriceA - binancePriceA) / binancePriceA) * 100;
        const upbitPriceB = market.marketMap[keyB].upbit;
        const binancePriceB =
          market.marketMap[keyB].binance *
          market.marketMap.exchangeRate.basePrice;

        const diffB = ((upbitPriceB - binancePriceB) / binancePriceB) * 100;
        // 차이가 큰 순으로 정렬
        if (!binancePriceA) {
          return 1; // A를 뒤로 보냄
        }
        if (!binancePriceB) {
          return -1; // B를 뒤로 보냄
        }

        // 차이가 큰 순으로 정렬
        return diffB - diffA;
      });

      for (let i = 0; i < market.cryptos.length; i++) {
        const symbol = market.cryptos[i].market.replace("KRW-", "");
        if (i !== market.marketMap[symbol].index) {
          market.marketMap[symbol].index = i;
          function drawItem() {
            drawRow(
              i,
              symbol,
              market.cryptos[i].korean_name,
              market.marketMap[symbol].upbit,
              market.marketMap[symbol].binance,
              market.cryptos[i].prev_closing_price,
              market.marketMap.exchangeRate.basePrice
            );
          }
          requestAnimationFrame(drawItem);
        }
      }
    }, 500);

    const upbitWebSocket = UpbitWebSocket(market.upbitCodes, market);
    const binanceWebSocket = BinanceWebSocket(
      market.binanceCodes,
      market.marketMap
    );
    const bitthumbWebSocket = BithumbWebSocket();

    return () => {
      upbitWebSocket.close();
      binanceWebSocket.close();
      bitthumbWebSocket.close();
    };
  }, [market]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TableStyled>
      <TheadStyled>
        <tr>
          <th>코인</th>
          <th>현재가</th>
          <th>김프</th>
          <th>전일대비</th>
          <th>UPBIT</th>
          <th>UPBIT</th>
          <th>UPBIT</th>
        </tr>
      </TheadStyled>
      <tbody>
        {market.cryptos.map((crypto: any, index: number) => (
          <MarketTableItem
            key={crypto.market}
            index={index}
            marketMap={market.marketMap}
            crypto={crypto}
            tradePrice={
              market.marketMap[crypto.market.replace("KRW-", "")].upbit
            }
            binanceTradePrice={
              market.marketMap[crypto.market.replace("KRW-", "")].binance
            }
            exchangeRate={market.marketMap.exchangeRate.basePrice}
          />
        ))}
      </tbody>
    </TableStyled>
  );
}

const TableStyled = styled.table``;

const TheadStyled = styled.thead`
  cursor: pointer;
`;
