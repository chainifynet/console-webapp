export const Logo = (props: Props) => {
  return (
    <div
      className={`btn btn-ghost hover:bg-transparent no-animation normal-case cursor-default text-xl mb-2`}
      style={{ alignItems: "center" }}
    >
      <img src="/logo.svg" alt="Logo" className="object-contain" style={{ height: "70%" }} />
    </div>
  );
};

type Props = {};
