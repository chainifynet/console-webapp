import { useNavigate } from "react-router-dom";

interface Props {
  items?: {
    label: string;
    link?: string;
  }[];
}
const BreadCrumbs: React.FC<Props> = ({ items = [] }: Props) => {
  const navigate = useNavigate();
  if (!items.length) return <></>;
  return (
    <div className="text-sm breadcrumbs -mt-2 mb-2">
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            {item.link ? (
              <a onClick={() => (item?.link ? navigate(item.link) : null)}>{item.label}</a>
            ) : (
              <>{item.label}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
