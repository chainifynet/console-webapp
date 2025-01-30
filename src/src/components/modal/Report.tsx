import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../hooks/api";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as api from "../../lib/api/api";
import { downloadTxReport } from "../../lib/utils/csv";

interface ReportProps {
  vaultId: string;
  walletId: string;
}

const invalidMonthLabel = "Invalid date format";
const title = "Wallet Report";

const Report = (props: ReportProps) => {
  const { vaultId, walletId } = props;
  const navigate = useNavigate();
  const getAccessTokenSilently = useTokenSilently();

  const { data: wallet } = useWallet(vaultId, walletId);
  const [month, setMonth] = useState("");
  const [monthValidError, setMonthValidError] = useState("");
  const [doGetReport, state, reset] = useApi(async () => {
    if (!vaultId || !walletId) {
      throw new Error("Invalid parameters");
    }
    if (!isValidDateFormat(month)) {
      setMonthValidError(invalidMonthLabel);
      return;
    }
    const token = await getAccessTokenSilently();
    const res = await api.getWalletReport(token, vaultId, walletId, month);
    if (!res.transactions?.length) {
      throw new Error(`No transactions found for month: ${month}`);
    }
    return res;
  });

  // reset on unmount
  useEffect(() => {
    return () => {
      setMonth("");
      setMonthValidError("");
      reset();
    };
  }, []);

  // download when report is ready
  useEffect(() => {
    if (state.value?.transactions?.length) {
      const fileName = `${walletId}-${month}.csv`;
      downloadTxReport(fileName, state.value.transactions, wallet.assetId);
    }
  }, [state.value?.transactions?.length]);

  const onChangeMonth = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value.length < 7) {
      setMonthValidError("");
    } else if (!isValidDateFormat(ev.target.value)) {
      setMonthValidError(invalidMonthLabel);
    }
    setMonth(ev.target.value);
  };

  if (state.error) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-sm text-error flex items-center space-x-1 mb-3">
          <Icon icon="ph:x-circle-bold" fontSize={20} />
          <div className="font-bold">Error generating report</div>
        </div>
        <p className="text-sm text-error">{state.error?.message}</p>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="flex space-x-4 items-center">
          <div className="w-4 h-4 border-t-2 border-solid rounded-full animate-spin"></div>
          <div>Generating report, this might take some time...</div>
        </div>
      </div>
    );
  }

  if (state.value) {
    return (
      <div>
        <h3 className="font-bold text-lg mb-8">{title}</h3>
        <div className="text-sm text-success flex items-center space-x-1 mb-3">
          <Icon icon="ph:check-circle-bold" fontSize={20} />
          <div className="font-bold">Report generated successfully, it will download shortly</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-8">{title}</h3>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Month of Report (yyyy-mm)</span>
        </label>
        <input
          type="text"
          placeholder="e.g.: 2023-03"
          className={classNames("input input-bordered w-full", { "input-error": monthValidError })}
          required
          value={month}
          onChange={onChangeMonth}
        />

        <label className="label">
          {monthValidError ? (
            <span className="label-text-alt text-error">{monthValidError}</span>
          ) : (
            <span className="label-text-alt text-error">&nbsp;</span>
          )}
        </label>
      </div>
      <div className="modal-action">
        <button className="btn" onClick={() => navigate("#")}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={doGetReport}>
          Build & Download Report
        </button>
      </div>
    </div>
  );
};

export default Report;

function isValidDateFormat(dateString: string) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(dateString);
}
