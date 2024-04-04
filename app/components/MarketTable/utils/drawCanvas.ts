import { matchDecimal } from "@/app/utils/matchDecimal";
import { withCommas } from "@/app/utils/withCommas";

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
  const koreanCanvas = document.getElementById(`${index}-KOREAN-NAME`);
  const englishCanvas = document.getElementById(`${index}-SYMBOL-NAME`);

  if (!koreanCanvas || !englishCanvas) return;

  koreanCanvas.textContent = koreanName;
  englishCanvas.textContent = symbol;
}

export function drawPrice(
  index: number,
  price: number,
  matchDecimalPrice: number,
  exchangeRate: number,
  market: "UPBIT" | "BINANCE"
) {
  const canvas =
    market === "UPBIT"
      ? (document.getElementById(`${index}-UPBIT-PRICE`) as HTMLCanvasElement)
      : (document.getElementById(
          `${index}-BINANCE-PRICE`
        ) as HTMLCanvasElement);

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  window.devicePixelRatio = 2;
  const scale = window.devicePixelRatio;

  const width = canvas.offsetWidth * scale;
  const height = canvas.offsetHeight * scale;
  canvas.width = width;
  canvas.height = height;

  ctx.scale(scale, scale);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = "14px Apple SD Gothic Neo, sans-serif";
  ctx.fillStyle = market === "UPBIT" ? "#000000" : "#71717a";

  if (market === "UPBIT") {
    ctx.fillText(withCommas(price), width / 2, height / 2 / 2);
  } else {
    ctx.fillText(
      price
        ? withCommas(matchDecimal(matchDecimalPrice, price * exchangeRate))
        : "-",
      width / 2,
      height / 2 / 2
    );
  }
}

export function drawKimp(
  index: number,
  upbitPrice: number,
  binancePrice: number,
  exchangeRate: number
) {
  if (!upbitPrice || !binancePrice) return; // 업비트 TON이랑 바이낸스 TON이랑 다른 코인임 * 임시조치

  const ratioCanvas = document.getElementById(
    `${index}-KIMP-RATIO`
  ) as HTMLCanvasElement;
  const diffCanvas = document.getElementById(
    `${index}-KIMP-DIFF`
  ) as HTMLCanvasElement;

  if (!ratioCanvas || !diffCanvas) return;

  const ratioCtx = ratioCanvas.getContext("2d");
  const diffCtx = diffCanvas.getContext("2d");

  if (!ratioCtx || !diffCtx) return;

  window.devicePixelRatio = 2;
  const scale = window.devicePixelRatio;

  const width = ratioCanvas.offsetWidth * scale;
  const height = ratioCanvas.offsetHeight * scale;
  ratioCanvas.width = width;
  ratioCanvas.height = height;
  diffCanvas.width = width;
  diffCanvas.height = height;

  ratioCtx.scale(scale, scale);
  diffCtx.scale(scale, scale);
  ratioCtx.textAlign = "right";
  ratioCtx.textBaseline = "middle";
  diffCtx.textAlign = "right";
  diffCtx.textBaseline = "middle";
  ratioCtx.font = "14px Apple SD Gothic Neo, sans-serif";
  diffCtx.font = "14px Apple SD Gothic Neo, sans-serif";

  const binancePriceToKRW = binancePrice * exchangeRate;

  if (upbitPrice > binancePriceToKRW) ratioCtx.fillStyle = "#c84a31";
  else if (upbitPrice < binancePriceToKRW) ratioCtx.fillStyle = "#1261c4";
  else ratioCtx.fillStyle = "#71717a";
  diffCtx.fillStyle = "#71717a";

  const ratio = ((upbitPrice - binancePriceToKRW) / binancePriceToKRW) * 100;
  const diff = upbitPrice - binancePriceToKRW;

  if (ratio)
    ratioCtx.fillText(
      ratio > 0 ? `+${ratio.toFixed(2)}%` : `${ratio.toFixed(2)}%`.toString(),
      width / 2,
      height / 2 / 2
    );
  else ratioCtx.fillText("-", width / 2, height / 2 / 2);

  diffCtx.fillText(
    diff
      ? diff > 0
        ? `+${withCommas(matchDecimal(upbitPrice, diff))}`
        : withCommas(matchDecimal(upbitPrice, diff))
      : "-",
    width / 2,
    height / 2 / 2
  );
}
