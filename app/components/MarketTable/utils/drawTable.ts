import { matchDecimal } from "@/app/utils/matchDecimal";
import { withCommas } from "@/app/utils/withCommas";

export function drawRow(
  index: number,
  symbol: string,
  koreanName: string,
  upbitPrice: number,
  binancePrice: number,
  prevClosingPrice: number,
  exchangeRate: number
) {
  drawSymbol(index, symbol);
  drawName(index, symbol, koreanName);
  drawPrice(index, upbitPrice, upbitPrice, exchangeRate, "UPBIT");
  drawPrice(index, binancePrice, upbitPrice, exchangeRate, "BINANCE");
  drawKimp(index, upbitPrice, binancePrice, exchangeRate);
  drawPrevDayDiff(index, upbitPrice, prevClosingPrice);
}

export function drawSymbol(index: number, symbol: string) {
  const canvas = document.getElementById(
    `${index}-SYMBOL`
  ) as HTMLCanvasElement;

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const img = new Image();
  img.onload = function () {
    // 이미지가 로드될 때만 캔버스 크기를 조정합니다. // 깜빡이는 현상 해결
    window.devicePixelRatio = 2;
    const scale = window.devicePixelRatio;

    const width = canvas.offsetWidth * scale;
    const height = canvas.offsetHeight * scale;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
  };
  img.src = `https://static.upbit.com/logos/${symbol}.png`;
}

export function drawName(index: number, symbol: string, koreanName: string) {
  const koreanEl = document.getElementById(`${index}-KOREAN-NAME`);
  const englishEl = document.getElementById(`${index}-SYMBOL-NAME`);

  if (!koreanEl || !englishEl) return;

  koreanEl.textContent = koreanName;
  englishEl.textContent = symbol;
}

export function drawPrice(
  index: number,
  price: number,
  matchDecimalPrice: number,
  exchangeRate: number,
  market: "UPBIT" | "BINANCE"
) {
  const el =
    market === "UPBIT"
      ? document.getElementById(`${index}-UPBIT-PRICE`)
      : document.getElementById(`${index}-BINANCE-PRICE`);

  if (!el) return;

  if (market === "UPBIT") {
    el.textContent = withCommas(price);
  } else {
    price
      ? (el.textContent = withCommas(
          matchDecimal(matchDecimalPrice, price * exchangeRate)
        ))
      : (el.textContent = "-");
  }
}

export function drawKimp(
  index: number,
  upbitPrice: number,
  binancePrice: number,
  exchangeRate: number
) {
  if (!upbitPrice || !binancePrice) return;

  const ratioEl = document.getElementById(`${index}-KIMP-RATIO`);
  const diffEl = document.getElementById(`${index}-KIMP-DIFF`);

  if (!ratioEl || !diffEl) return;

  const binancePriceToKRW = binancePrice * exchangeRate;

  const ratio = ((upbitPrice - binancePriceToKRW) / binancePriceToKRW) * 100;
  const diff = upbitPrice - binancePriceToKRW;

  if (ratio >= 0) ratioEl.style.color = "var(--rise-color)";
  else ratioEl.style.color = "var(--fall-color)";

  ratioEl.textContent =
    ratio > 0 ? `+${ratio.toFixed(2)}%` : `${ratio.toFixed(2)}%`;

  diffEl.textContent =
    diff > 0
      ? `+${withCommas(matchDecimal(upbitPrice, diff))}`
      : withCommas(matchDecimal(upbitPrice, diff));
}

export function drawPrevDayDiff(
  index: number,
  price: number,
  prevDayPrice: number
) {
  const ratioEl = document.getElementById(`${index}-PREV-DAY-RATIO`);
  const diffEl = document.getElementById(`${index}-PREV-DAY-DIFF`);

  if (!ratioEl || !diffEl) return;

  const ratio = ((price - prevDayPrice) / prevDayPrice) * 100;
  const diff = price - prevDayPrice;

  if (ratio >= 0) ratioEl.style.color = "var(--rise-color)";
  else ratioEl.style.color = "var(--fall-color)";

  ratioEl.textContent =
    ratio > 0 ? `+${ratio.toFixed(2)}%` : `${ratio.toFixed(2)}%`;
  diffEl.textContent =
    diff > 0
      ? `+${withCommas(matchDecimal(price, diff))}`
      : withCommas(matchDecimal(price, diff));
}
