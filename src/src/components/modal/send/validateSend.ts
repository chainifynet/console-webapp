import { Wallet } from "../../../../types/types";
import { FeeEstimate } from "../../../hooks/fetch/useFeeEstimate";

export function validateSend(params: SendParams, wallet: Wallet, fee?: FeeEstimate): SendValidation | undefined {
  const { amount, address } = params;
  const errors: SendValidation = {};

  if (!amount) {
    errors.amount = "Amount is required";
  }

  if (!address) {
    errors.address = "Recipient is required";
  }

  if (!Object.keys(errors).length) {
    return undefined;
  }

  if (Number(amount) > Number(wallet.balance) - Number(fee?.amount)) {
    errors.amount = "Insufficient funds";
  }
  return errors;
}

interface SendParams {
  amount: string;
  address: string;
  note?: string;
}

export interface SendValidation {
  amount?: string;
  address?: string;
  note?: string;
}
