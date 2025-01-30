export const Watermark = (props: Props) => {
  const { text } = props;
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-2xl text-bold opacity-40 p-6 rounded">{text}</div>
    </div>
  );
};

type Props = {
  text: string;
};
