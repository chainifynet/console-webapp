export const Amount = ({ amount, asset, formattedFiatAmount, direction = "OUT" }: Props) => {
  const color = direction === "IN" ? "text-success" : "";

  return (
    <div className="flex flex-col whitespace-nowrap">
      <div>
        <span className={`font-bold ${color}`}>
          {direction === "IN" ? "+" : ""} {amount}
        </span>
        <span className={`text-sm ${color}`}>&nbsp;{asset}</span>
      </div>
      <div>
        <span className={`text-sm font-semibold ${color}`}>{formattedFiatAmount}</span>
      </div>
    </div>
  );
};

type Props = {
  amount: number | string;
  asset: string;
  formattedFiatAmount: string | undefined;
  direction?: "IN" | "OUT";
};
