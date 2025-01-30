import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { Dispatch } from "../store";
/**
 * Will fetch prices and save them to the redux store every 5 minutes
 */
export default function usePrices() {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.prices.getPrices();
    const interval = setInterval(() => {
      dispatch.prices.getPrices();
    }, 5 * 60_000);

    return () => clearInterval(interval);
  }, []);
}
