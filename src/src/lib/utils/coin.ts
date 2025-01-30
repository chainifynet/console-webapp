import Big from "big.js";
import { isSandbox } from "../../constants";
import { addIcon } from "@iconify/react";

addIcon("@custom:crypto:busd", {
  body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 2500"><path d="M1250 0c690.3 0 1250 559.7 1250 1250s-559.7 1250-1250 1250S0 1940.3 0 1250 559.7 0 1250 0z"/><path d="M400 1250.4l212.3-212.3 212.3 212.3-212.3 212.3L400 1250.4zm1487.7-213.7l-851 851L1249 2100l851-851-212.3-212.3zM718.4 1568.8l851-851 212.3 212.3-851 851-212.3-212.3zm-.4-636.3L1250.5 400l212.3 212.3-532.5 532.5L718 932.5z" fill="#f0b90b"/></svg>',
  width: 24,
  height: 24,
});

addIcon("@custom:vendor:chainalysis", {
  body: '<svg id="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Chainalysis</title><path fill="#ec5f2a" d="M50 0c1.12 0 2.39.14 2.39.14a28.31 28.31 0 00-6.48 15.92 33.76 33.76 0 00-27.86 28.59c-6.47.7-13.79 3.66-18 7.89C-.95 23.52 21.29 0 50 0zm7.2 87.18a27 27 0 01-4 .29 49.17 49.17 0 01-6.9-.57 51.83 51.83 0 01-7 12A50 50 0 011.72 62.82c4.51-5.35 14.93-8.45 21.4-8.45 13.8 0 21.12 7.32 23.66 18.73-8.31-2.25-13.24-6.9-16.48-13.8a16.68 16.68 0 00-5.91-1 16.83 16.83 0 00-5.35.85C22.7 73.1 36.22 83.52 52.69 83.52c15.21 0 21.68-7.74 21.68-7.74V63.94s-7.46 7.75-16.75 9.3A33.74 33.74 0 0028.9 44.65C31.29 32.82 40.3 26.2 52.55 26.2s22.11 8.87 22.11 8.87V23.38s-6.34-5.92-17.6-7.18c.28-5.2 3.66-11.69 7.32-14.09C79.72 6.9 94.51 19.86 98.73 38.73c0 0-6.76 6.76-19.43 6.76-10.42 0-17-5.21-20.7-14.36a17.28 17.28 0 00-6.05-1 15.4 15.4 0 00-5.63 1c4.08 14.65 17 24.5 31.4 24.5 14.08 0 21.68-6.47 21.68-6.47 0 29.29-22.39 50.28-49 50.84 3.1-3 5.49-9.58 6.2-12.82z"></path></svg>',
  width: 24,
  height: 24,
});

export const enum AssetType {
  NATIVE = "NATIVE",
  TRC20 = "TRC20",
  ERC20 = "ERC20",
  BRC20 = "BRC20",
}

const patterns = {
  EVM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRON_ADDRESS: /^T[a-zA-Z1-9]{33}$/,
  EVM_TX_HASH: /^0x[a-fA-F0-9]{64}$/,
  TRON_TX_HASH: /^[a-fA-F0-9]{64}$/,
};

// TODO! get this from assets DB on the backend once implemented
const assets: Record<string, Asset> = {
  TRX: {
    assetId: "TRX",
    symbol: "TRX",
    name: "Tron",
    decimals: 6,
    assetType: AssetType.NATIVE,
    nativeAsset: "TRX",
    icon: "cryptocurrency-color:trx",
  },
  USDT_TRX: {
    assetId: "USDT_TRX",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    assetType: AssetType.TRC20,
    nativeAsset: "TRX",
    contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    icon: "cryptocurrency-color:usdt",
  },
  ETH: {
    assetId: "ETH",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    assetType: AssetType.NATIVE,
    nativeAsset: "ETH",
    icon: "cryptocurrency-color:eth",
  },
  USDT_ETH: {
    assetId: "USDT_ETH",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    assetType: AssetType.ERC20,
    nativeAsset: "ETH",
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    icon: "cryptocurrency-color:usdt",
  },
  USDC_ETH: {
    assetId: "USDC_ETH",
    symbol: "USDC",
    name: "USDC",
    decimals: 6,
    assetType: AssetType.ERC20,
    nativeAsset: "ETH",
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    icon: "cryptocurrency-color:usdc",
  },

  BAT_ETH: {
    assetId: "BAT_ETH",
    symbol: "BAT",
    name: "Basic Attention Token",
    decimals: 18,
    assetType: AssetType.ERC20,
    nativeAsset: "ETH",
    contractAddress: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
    icon: "cryptocurrency-color:bat",
  },

  BNB: {
    assetId: "BNB",
    symbol: "BNB",
    name: "Binance Coin",
    decimals: 18,
    assetType: AssetType.NATIVE,
    nativeAsset: "BNB",
    icon: "cryptocurrency-color:bnb",
  },

  BUSD_BNB: {
    assetId: "BUSD_BNB",
    symbol: "BUSD",
    name: "Binance USD",
    decimals: 18,
    assetType: AssetType.BRC20,
    nativeAsset: "BNB",
    contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    icon: "@custom:crypto:busd",
  },

  BTC: {
    assetId: "BTC",
    symbol: "BTC",
    name: "Bitcoin",
    decimals: 8,
    assetType: AssetType.NATIVE,
    nativeAsset: "BTC",
    icon: "cryptocurrency-color:btc",
    // chainType: ChainType.UTXO, // UTXO or Account
  },

  // Testnets
  TRX_SHASTA: {
    assetId: "TRX_SHASTA",
    symbol: "TRX",
    name: "Shasta Tron",
    decimals: 6,
    assetType: AssetType.NATIVE,
    nativeAsset: "TRX_SHASTA",
    testnet: "SHASTA",
    icon: "cryptocurrency-color:trx",
  },
  USDT_TRX_SHASTA: {
    assetId: "USDT_TRX_SHASTA",
    symbol: "USDT",
    name: "Shasta USDT",
    decimals: 6,
    assetType: AssetType.TRC20,
    nativeAsset: "TRX_SHASTA",
    contractAddress: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
    testnet: "SHASTA",
    icon: "cryptocurrency-color:usdt",
  },

  ETH_GOERLI: {
    assetId: "ETH_GOERLI",
    symbol: "ETH",
    name: "Goerli Ethereum",
    decimals: 18,
    assetType: AssetType.NATIVE,
    nativeAsset: "ETH_GOERLI",
    testnet: "GOERLI",
    icon: "cryptocurrency-color:eth",
  },

  USDC_ETH_GOERLI: {
    assetId: "USDC_ETH_GOERLI",
    symbol: "USDC",
    name: "Goerli USDC",
    decimals: 6,
    assetType: AssetType.ERC20,
    nativeAsset: "ETH_GOERLI",
    contractAddress: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    testnet: "GOERLI",
    icon: "cryptocurrency-color:usdc",
  },

  BNB_TESTNET: {
    assetId: "BNB_TESTNET",
    symbol: "BNB",
    name: "Binance Coin",
    decimals: 18,
    assetType: AssetType.NATIVE,
    nativeAsset: "BNB_TESTNET",
    testnet: "BNB_TESTNET",
    icon: "cryptocurrency-color:bnb",
  },

  BUSD_BNB_TESTNET: {
    assetId: "BUSD_BNB_TESTNET",
    symbol: "BUSD",
    name: "Binance USD",
    decimals: 18,
    assetType: AssetType.BRC20,
    nativeAsset: "BNB_TESTNET",
    contractAddress: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    testnet: "BNB_TESTNET",
    icon: "@custom:crypto:busd",
  },

  BTC_TESTNET: {
    assetId: "BTC_TESTNET",
    symbol: "BTC",
    name: "Bitcoin",
    decimals: 8,
    assetType: AssetType.NATIVE,
    nativeAsset: "BTC_TESTNET",
    testnet: "BTC_TESTNET",
    icon: "cryptocurrency-color:btc",
    // chainType: ChainType.UTXO, // UTXO or Account
  },
};

/**
 * Gets asset info by assetId, if not found returns empty object
 */
export function getAssetSafe(assetId: string): Asset | {} {
  if (!assetId) {
    return {};
  }
  const asset = assets[assetId.toUpperCase()];
  if (!asset) {
    return {};
  }
  return asset;
}

export function getAsset(assetId: string): Asset {
  const asset = assets[assetId.toUpperCase()];
  if (!asset) {
    throw new Error(`Asset ${assetId} not found`);
  }
  return asset;
}

export function getIcon(coin = "") {
  const asset = <Asset>getAssetSafe(coin);
  return asset?.icon || "";
}

export function toNative(amount: number | string, assetId: string): string {
  const asset = getAsset(assetId);
  return Big(amount)
    .mul(10 ** asset.decimals)
    .toFixed(0);
}

export function fromNativeParsed(amount: string | number = 0, assetId: string) {
  return formatAmount(fromNative(amount, assetId));
}

export function fromNative(amount: string | number = 0, assetId: string) {
  if (!assetId || !amount || Big(amount).eq(0)) {
    return "0";
  }
  const asset = getAsset(assetId);
  return Big(amount)
    .div(10 ** asset.decimals)
    .toFixed();
}

const usdMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function toUSD(amount: string | number = 0, assetId: string, prices: Record<string, number> = {}) {
  const parsedAmount = fromNative(amount, assetId);
  const rate = prices[assetId];
  if (rate) {
    return usdMoney.format(Big(parsedAmount).mul(rate).toNumber());
  }
  return undefined;
}

export function inputToUSD(amount: string | number | Big = 0, assetId: string, prices: Record<string, number> = {}) {
  const rate = prices[assetId];
  if (rate) {
    return usdMoney.format(Big(amount).mul(rate).toNumber());
  }
  return undefined;
}

/**
 *
 * @param {*} assetId
 * @returns {"ETH" |"ETH_GOERLI"}
 */
export function getExplorerType(assetId: string) {
  const asset = getAsset(assetId);

  return asset.assetType;
}

export function explorerTxUrl(assetId: string, txId: string) {
  const asset = getAsset(assetId);
  if (asset.nativeAsset === "TRX") {
    return `https://tronscan.org/#/transaction/${txId}`;
  }
  if (asset.nativeAsset === "ETH") {
    return `https://etherscan.io/tx/${txId}`;
  }
  if (asset.nativeAsset === "BNB") {
    return `https://bscscan.com/tx/${txId}`;
  }
  if (asset.nativeAsset === "TRX_SHASTA") {
    return `https://shasta.tronscan.org/#/transaction/${txId}`;
  }
  if (asset.nativeAsset === "ETH_GOERLI") {
    return `https://goerli.etherscan.io/tx/${txId}`;
  }
  if (asset.nativeAsset === "BNB_TESTNET") {
    return `https://testnet.bscscan.com/tx/${txId}`;
  }
  if (asset.nativeAsset === "BTC") {
    return `https://mempool.space/tx/${txId}`;
  }
  if (asset.nativeAsset === "BTC_TESTNET") {
    return `https://mempool.space/testnet/tx/${txId}`;
  }
  throw new Error(`Unsupported chain: ${asset.nativeAsset}`);
}

export function explorerAddressUrl(assetId: string, address: string) {
  const asset = getAsset(assetId);
  if (asset.nativeAsset === "TRX") {
    return `https://tronscan.org/#/address/${address}`;
  }
  if (asset.nativeAsset === "ETH") {
    return `https://etherscan.io/address/${address}`;
  }
  if (asset.nativeAsset === "BNB") {
    return `https://bscscan.com/address/${address}`;
  }
  if (asset.nativeAsset === "TRX_SHASTA") {
    return `https://shasta.tronscan.org/#/address/${address}`;
  }
  if (asset.nativeAsset === "ETH_GOERLI") {
    return `https://goerli.etherscan.io/address/${address}`;
  }
  if (asset.nativeAsset === "BNB_TESTNET") {
    return `https://testnet.bscscan.com/address/${address}`;
  }
  if (asset.nativeAsset === "BTC") {
    return `https://mempool.space/address/${address}`;
  }
  if (asset.nativeAsset === "BTC_TESTNET") {
    return `https://mempool.space/testnet/address/${address}`;
  }
  throw new Error(`Unsupported chain: ${asset.nativeAsset}`);
}

export function looksValidAddressOrTxHash(input: string): boolean {
  return Object.values(patterns).some((pattern) => {
    if (pattern.test(input)) {
      return true;
    }
    return false;
  });
}

export function getKind(input: string): string | null {
  const res = Object.entries(patterns).find(([key, pattern]) => {
    if (pattern.test(input)) {
      return true;
    }
    return false;
  });
  if (res) {
    return res[0];
  }
  return null;
}

export function getAssetType(assetId: string) {
  if (!assetId) {
    return "";
  }
  const asset = getAsset(assetId);
  return asset.assetType;
}

export function getMainAssetId(assetId: string) {
  const asset = getAsset(assetId);
  return asset.nativeAsset;
}

const formatter = new Intl.NumberFormat("en");

function formatAmount(num: string | number) {
  if (!num) {
    return num;
  }
  const [whole, decimal] = String(num).split(".");
  const wholeF = formatter.format(Number(whole));
  if (decimal) {
    return `${wholeF}.${decimal}`;
  }
  return wholeF;
}

const sandboxAssets = Object.values(assets)
  .filter((a) => a.testnet)
  .map((a) => a.assetId);
export function getCreateWalletAssetList() {
  if (isSandbox) {
    return Object.values(assets).filter(({ assetId }) => sandboxAssets.includes(assetId));
  }
  return Object.values(assets).filter(({ assetId }) => !sandboxAssets.includes(assetId));
}

function isEthNetwork(asset: Asset) {
  if (asset.assetType === AssetType.ERC20) return true;
  return asset.assetId === "ETH" || asset.assetId === "ETH_GOERLI";
}

function isBscNetwork(asset: Asset) {
  if (asset.assetType === AssetType.BRC20) return true;
  return asset.assetId === "BNB" || asset.assetId === "BNB_TESTNET";
}

function isTrxNetwork(asset: Asset) {
  if (asset.assetType === AssetType.TRC20) return true;
  return asset.assetId === "TRX" || asset.assetId === "TRX_SHASTA";
}

export const validateAddress = (address: string, assetId: string) => {
  const asset = <Asset>getAssetSafe(assetId);
  if (!asset?.assetId) {
    return false;
  }
  if (isEthNetwork(asset) || isBscNetwork(asset)) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  if (isTrxNetwork(asset)) {
    return /^T[a-zA-Z1-9]{33}$/.test(address);
  } else {
    return validateAddressMAV(address, asset);
  }
};

function validateAddressMAV(address: string, asset: Asset) {
  let symbol = asset.symbol;
  if (asset.assetType !== AssetType.NATIVE) {
    symbol = (<Asset>getAssetSafe(asset.nativeAsset))?.symbol;
    if (!symbol) {
      return false;
    }
  }
  // @ts-ignore
  if (window.WAValidator?.validate(address, symbol.toLowerCase(), asset.testnet ? "testnet" : "prod")) {
    return true;
  }
  return false;
}

export type Asset = {
  assetId: string;
  symbol: string;
  name: string;
  decimals: number;
  assetType: AssetType;
  nativeAsset: string;
  icon: string;
  contractAddress?: string;
  testnet?: string;
};
