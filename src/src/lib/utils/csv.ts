import { Tx } from "../../../types/types";
import { fromNative, getAsset } from "./coin";

export function downloadTxReport(fileName: string, data: Tx[], assetId: string) {
  const asset = getAsset(assetId);
  const csvData = [
    [
      "vaultId",
      "walletId",
      "txId",
      "txHash",
      "status",
      "direction",
      "from",
      "to",
      "amount",
      "amountUsd",
      "assetId",
      "externalId",
      "createdAt",
      "updatedAt",
      "type",
      "timestamp",
      "minerFee",
      "minerFeeUsd",
    ].join(), // header
    ...data.map(
      (item) =>
        [
          item.vaultId,
          item.walletId,
          item.txId,
          item.txHash,
          item.status,
          item.direction,
          item.from,
          item.to,
          fromNative(item.amount, item.assetId),
          item.amountUsd,
          item.assetId,
          item.externalId,
          item.createdAt,
          item.updatedAt,
          item.type,
          item.timestamp,
          fromNative(item.minerFee, asset.nativeAsset),
          item.minerFeeUsd,
        ].join(",") // data row
    ), // data rows
  ].join("\n");

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
