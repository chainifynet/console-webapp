import { Icon } from "@iconify/react";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { RootState, Dispatch } from "../../store";

const timeoutMs = 5000;

export const Toasta = () => {
  const errors = useSelector((state: RootState) => state.errors);
  const dispatch = useDispatch<Dispatch>();

  // clear errors after timeout
  useEffect(() => {
    if (!errors.length) {
      return;
    }
    const timeout = setTimeout(() => {
      if (errors.length) {
        dispatch.errors.clear();
      }
    }, timeoutMs);
    return () => {
      clearTimeout(timeout);
      if (errors.length) {
        dispatch.errors.clear();
      }
    };
  }, [errors.length]);

  if (!errors.length) {
    return <></>;
  }

  return (
    <div className="alert alert-error shadow-lg">
      <div>
        <Icon icon="ph:warning-circle-bold" />
        {errors.map((err, i) => (
          <div key={i}>{err}</div>
        ))}
      </div>
    </div>
  );
};

const colorIcon = {
  info: ["bg-info", "ph:info-bold"],
  success: ["bg-success", "ph:check-circle-bold"],
  warning: ["bg-warning", "ph:warning-circle-bold"],
  error: ["bg-error", "ph:x-circle-bold"],
};

export const Toast = (props: Props) => {
  const { type = "error" } = props;

  const errors = useSelector((state: RootState) => state.errors);
  const dispatch = useDispatch<Dispatch>();

  const color = colorIcon[type]?.[0];
  const icon = colorIcon[type]?.[1];

  const onClose = () => {
    dispatch.errors.clear();
  };

  // clear errors after timeout
  useEffect(() => {
    if (!errors.length) {
      return;
    }
    const timeout = setTimeout(() => {
      if (errors.length) {
        dispatch.errors.clear();
      }
    }, timeoutMs);
    return () => clearTimeout(timeout);
  }, [errors.length]);

  if (!errors.length) {
    return <></>;
  }

  return (
    <div
      className={`fixed left-1/2 top-4 transform -translate-x-1/2  p-4 rounded-md ${color} text-white shadow-lg w-1/3`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Icon icon={icon} className="mr-4" width={26} />
          <div className="flex flex-col justify-between items-center">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        </div>

        <div className="flex ml-4">
          <button onClick={onClose} className="text-white focus:outline-none focus-visible:ring-2 ring-white">
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

type Props = {
  type?: "info" | "success" | "warning" | "error";
};
