import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "./Navbar";
import { Dispatch, RootState } from "../../store";

export const Menu = (props: MenuProps) => {
  const { children, items } = props;
  const drawer = useSelector((state: RootState) => state.drawer);
  const dispatch = useDispatch<Dispatch>();
  return (
    <div className="drawer drawer-mobile">
      <input id="sidemenu-drawer" type="checkbox" className="drawer-toggle" checked={drawer.open} onChange={() => {}} />
      <div className="drawer-content">
        <Navbar />
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="sidemenu-drawer"
          className="drawer-overlay"
          onClick={() => dispatch.drawer.setOpen(false)}
        ></label>
        {items}
      </div>
    </div>
  );
};

type MenuProps = {
  children: React.ReactNode;
  items: React.ReactNode;
};
