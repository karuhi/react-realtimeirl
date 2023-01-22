import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

import { forPullKey } from "@rtirl/api";

const HandleHeartrate = (props: any) => {
  const [state, setState] = useContext(stateContext);
  // Add heartrate listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addHeartRateListener((rate) => {
      if (rate && state.heartRate !== rate) {
        setState((state: any) => ({ ...state, heartRate: rate }));
      }
    });
    //eslint-disable-next-line
  }, []);

  return props.children;
};

export default HandleHeartrate;
