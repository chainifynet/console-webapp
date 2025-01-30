import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import { Dispatch } from "../../store";

const iconWidth = 24;

export const MenuItem = (props: Props) => {
  const { path, label, icon, active, className } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const match = useMatch(path);
  const showActive = active ?? Boolean(match);

  return (
    <a
      onClick={() => {
        dispatch.drawer.setOpen(false);
        navigate(path);
      }}
      className={classNames(className, { active: showActive })}
    >
      {icon && <Icon icon={icon} width={iconWidth} />}
      {label}
    </a>
  );
};
type Props = {
  /** The path to navigate to, e.g.: "/accounts" */
  path: string;
  /** The label of the item */
  label: string;
  icon?: string;
  /** If not provided it will default to matching by the exact path */
  active?: boolean;
  className?: string;
};
