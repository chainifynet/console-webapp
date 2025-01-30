import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { looksValidAddressOrTxHash } from "../../lib/utils/coin";
import { useNavigate } from "react-router-dom";
import { usePrevious } from "react-use";
import { useQueryParam } from "../../hooks/useQueryParam";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../store";

export const Search = (props: SearchProps) => {
  const { hideOnLargeScreen = true } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const hideClass = hideOnLargeScreen ? "lg:hidden" : "hidden lg:flex";

  const q = useQueryParam("q");
  const prevQ = usePrevious(q);
  const [term, setTerm] = useState(q);
  const [searchErr, setSearchErr] = useState("");

  const onValueChange = (value: string) => {
    setTerm(value);
    setSearchErr("");
  };

  // clean up the search term when we navigate away from the page
  useEffect(() => {
    if (prevQ && !q) {
      onValueChange("");
    }
    return () => {
      if (prevQ && !q) {
        onValueChange("");
      }
    };
  }, [prevQ, q]);

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!term || searchErr) {
      return;
    }
    if (!looksValidAddressOrTxHash(term)) {
      setSearchErr("Invalid address or tx hash");
      return;
    }
    dispatch.drawer.setOpen(false);
    navigate("/search?q=" + term);
  };

  return (
    <form className={`relative mx-3 w-full ${hideClass}`} onSubmit={onSubmit}>
      <label htmlFor="search" className="mb-2 text-sm font-medium sr-only">
        Search address or tx
      </label>
      <div className="form-control">
        <div className="input-group input-group-sm">
          <div className="relative input-group">
            <input
              type="search"
              id="search"
              className={classNames("input w-full pr-10 bg-base-300 input-sm", { "input-error": Boolean(searchErr) })}
              // placeholder="Search address or tx hash"
              placeholder="Search address"
              value={term}
              onChange={(e) => onValueChange(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0  right-0 pr-3 flex items-center  cursor-pointer"
              onClick={() => onValueChange("")}
            >
              <Icon icon="ph:x-bold" width={16} opacity={0.6} className={classNames({ hidden: !Boolean(term) })} />
            </div>
          </div>
          <button className="btn btn-square btn-sm">
            <Icon icon="ph:magnifying-glass-bold" width={16} />
          </button>
        </div>
      </div>
    </form>
  );
};

type SearchProps = {
  /** defaults to false */
  hideOnLargeScreen: boolean;
};
