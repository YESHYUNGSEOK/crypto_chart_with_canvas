"use client";

import styled from "styled-components";
import { useEffect } from "react";
import { drawRow } from "@/app/components/MarketTable/utils/drawTable";

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
  marketMap[symbol].prevClosingPrice = crypto.prev_closing_price;

  useEffect(() => {
    drawRow(
      index,
      symbol,
      crypto.korean_name,
      tradePrice,
      binanceTradePrice,
      crypto.prev_closing_price,
      exchangeRate
    );
  }, []);

  return (
    <RowStyled>
      <CellStyled>
        <CellNameStyled>
          <canvas id={`${index}-SYMBOL`} />
          <NameContainerStyled>
            <p id={`${index}-KOREAN-NAME`} />
            <p id={`${index}-SYMBOL-NAME`} />
          </NameContainerStyled>
        </CellNameStyled>
      </CellStyled>
      <CellStyled>
        <CellPriceStyled>
          <p id={`${index}-UPBIT-PRICE`} />
          <p id={`${index}-BINANCE-PRICE`} />
        </CellPriceStyled>
      </CellStyled>
      <CellStyled>
        <CellKimpStyled>
          <p id={`${index}-KIMP-RATIO`} />
          <p id={`${index}-KIMP-DIFF`} />
        </CellKimpStyled>
      </CellStyled>
      <CellStyled>
        <CellPrevDayPriceStyled>
          <p id={`${index}-PREV-DAY-RATIO`} />
          <p id={`${index}-PREV-DAY-DIFF`} />
        </CellPrevDayPriceStyled>
      </CellStyled>
      <CellStyled>52주 최고가</CellStyled>
      <CellStyled>52주 최저가</CellStyled>
      <CellStyled>전일 종가</CellStyled>
    </RowStyled>
  );
}

const RowStyled = styled.tr`
  &:hover {
    background-color: #c6c4c4;
  }
  transition: 0.3s all ease;
`;

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
  p {
    &:nth-child(2) {
      color: var(--gray-color);
    }
  }
`;

const CellPriceStyled = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: right;
    min-width: 70px;
    &:nth-child(2) {
      color: var(--gray-color);
    }
  }
`;

const CellKimpStyled = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: right;
    min-width: 70px;
    &:first-child {
      color: var(--rise-color);
    }
    &:nth-child(2) {
      color: var(--gray-color);
    }
  }
`;

const CellPrevDayPriceStyled = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: right;
    min-width: 70px;
    &:first-child {
      color: var(--rise-color);
    }
    &:nth-child(2) {
      color: var(--gray-color);
    }
  }
`;
