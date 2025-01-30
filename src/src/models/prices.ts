import { createModel } from "@rematch/core";
import { RootModel } from ".";

export const prices = createModel<RootModel>()({
  state: <Record<string, number>>{}, // initial state
  reducers: {
    // handle state changes with pure functions
    set(state, payload: {}) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async getPrices() {
      const prices = await getUsdPrices();
      dispatch.prices.set(prices);
    },
  }),
});

async function getUsdPrices() {
  const ids = "tron,tether,ethereum,usd-coin,basic-attention-token,binancecoin,binance-usd,bitcoin";
  const vs_currencies = "usd";
  const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}`);
  const respJson = await resp.json();
  return {
    TRX: respJson?.tron?.usd,
    USDT_TRX: respJson?.tether?.usd,
    TRX_SHASTA: respJson?.tron?.usd,
    USDT_TRX_SHASTA: respJson?.tether?.usd,
    ETH: respJson?.ethereum?.usd,
    ETH_GOERLI: respJson?.ethereum?.usd,
    USDT_ETH: respJson?.tether?.usd,
    USDC_ETH: respJson?.["usd-coin"]?.usd,
    USDC_ETH_GOERLI: respJson?.["usd-coin"]?.usd,
    BAT_ETH: respJson?.["basic-attention-token"]?.usd,
    BNB: respJson?.["binancecoin"]?.usd,
    BNB_TESTNET: respJson?.["binancecoin"]?.usd,
    BUSD_BNB: respJson?.["binance-usd"]?.usd,
    BUSD_BNB_TESTNET: respJson?.["binance-usd"]?.usd,
    BTC: respJson?.["bitcoin"]?.usd,
    BTC_TESTNET: respJson?.["bitcoin"]?.usd,
  };
}
