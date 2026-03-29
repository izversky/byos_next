/**
 * Компонент для отображения цены крипто-валюты
 * Выделен в отдельный файл для переиспользования и чистоты кода
 */

import { toNum, formatPrice, formatPct } from "../utils";
import { BitcoinIcon, MeteoraIcon, SolIcon } from "../icons";
import type { TokenRow } from "../types";

interface CryptoItemProps {
  token: TokenRow;
}

/**
 * Иконка крипто-валюты на основе символа
 * @param symbol - символ монеты (BTC, SOL, MET)
 * @param className - дополнительные классы
 */
function CryptoIconBySymbol({
  symbol,
  className = "text-gray-500",
}: {
  symbol: string;
  className?: string;
}) {
  const iconProps = { className, width: "100%", height: "auto" };

  switch (symbol) {
    case "BTC":
      return <BitcoinIcon {...iconProps} />;
    case "MET":
      return <MeteoraIcon {...iconProps} />;
    case "SOL":
    default:
      return <SolIcon {...iconProps} />;
  }
}

/**
 * Компонент отдельного предмета крипто цены
 * Отображает иконку, цену и процент изменения за 24 часа
 */
export function CryptoItem({ token }: CryptoItemProps) {
  const priceUsd = toNum(token.priceUsd);
  const change24hPct = toNum(token.change24hPct);
  const isUp = (change24hPct ?? 0) >= 0;
  const arrow = isUp ? "↑" : "↓";

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7">
        <CryptoIconBySymbol symbol={token.symbol} />
      </div>
      <div className="font-inter text-[32px] leading-none text-gray-900">
        ${formatPrice(priceUsd)}
      </div>
      <span className="font-inter text-[16px] text-nowrap rounded-md border border-gray-500 text-gray-500 py-[1] px-[3]">
        {arrow} {formatPct(change24hPct)}%
      </span>
    </div>
  );
}
