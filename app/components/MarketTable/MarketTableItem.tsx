"use client";

import styled from "styled-components";
import Image from "next/image";
import { useEffect } from "react";
import {
  drawSymbol,
  drawName,
  drawKimp,
  drawPrice,
} from "@/app/components/MarketTable/utils/drawCanvas";

export function MarketTableItem({
  index,
  marketMap,
  crypto,
  tradePrice,
  binanceTradePrice,
  exchangeRate,
}: {
  index: number;
  marketMap: any;
  crypto: any;
  tradePrice: number;
  binanceTradePrice: number;
  exchangeRate: number;
}) {
  const symbol = crypto.market.replace("KRW-", ""); // ex.KRW-BTC -> BTC
  marketMap[symbol].index = index;

  // https://www.geeksforgeeks.org/how-to-sharpen-blurry-text-in-html5-canvas/
  useEffect(() => {
    drawSymbol(index, symbol);
    drawName(index, symbol, crypto.korean_name);
    drawPrice(index, tradePrice, tradePrice, exchangeRate, "UPBIT");
    drawPrice(
      index,
      binanceTradePrice,
      crypto.trade_price,
      exchangeRate,
      "BINANCE"
    );
    drawKimp(
      index,
      crypto.trade_price,
      crypto.binance_trade_price,
      exchangeRate
    );
  }, []);

  return (
    <RowStyled>
      <CellStyled>
        <CellNameStyled>
          <canvas id={`${index}-SYMBOL`} />
          <NameContainerStyled>
            <div id={`${index}-KOREAN-NAME`} />
            <div id={`${index}-SYMBOL-NAME`} />
          </NameContainerStyled>
        </CellNameStyled>
      </CellStyled>
      <CellStyled>
        <CellPriceStyled>
          <div>
            <canvas id={`${index}-UPBIT-PRICE`} />
          </div>
          <div>
            <canvas id={`${index}-BINANCE-PRICE`} />
          </div>
        </CellPriceStyled>
      </CellStyled>
      <CellStyled>
        <CellKimpStyled>
          <div>
            <canvas id={`${index}-KIMP-RATIO`} />
          </div>
          <div>
            <canvas id={`${index}-KIMP-DIFF`} />
          </div>
        </CellKimpStyled>
      </CellStyled>
      <CellStyled>거래대금(24H)</CellStyled>
      <CellStyled>52주 최고가</CellStyled>
      <CellStyled>52주 최저가</CellStyled>
      <CellStyled>전일 종가</CellStyled>
    </RowStyled>
  );
}

const RowStyled = styled.tr``;

const CellStyled = styled.td`
  padding: 5px;
`;

const CellNameStyled = styled.div`
  display: flex;
  & > canvas {
    height: 16.5px;
    width: 16.5px;
  }
`;

const NameContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  canvas {
    height: 16.5px;
    width: 140px;
  }
`;

const CellPriceStyled = styled.div`
  display: flex;
  flex-direction: column;
  div:nth-child(2) {
    color: var(--gray-color);
  }
  div {
    height: 16.5px;
  }
  canvas {
    height: 16.5px;
    width: 90px;
  }
`;

const CellKimpStyled = styled.div`
  display: flex;
  flex-direction: column;
  div:nth-child(2) {
    color: var(--gray-color);
  }
  div {
    height: 16.5px;
  }
  canvas {
    height: 16.5px;
    width: 90px;
  }
`;
