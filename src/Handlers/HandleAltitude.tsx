import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

import { forPullKey } from "@rtirl/api";

import isEmpty from "Functions/isEmpty";

const HandleAltitude = (props: any) => {
  const [state, setState] = useContext(stateContext);
  // Add altitude listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addAltitudeListener((alt: any) => {
      if (
        !isEmpty(alt) &&
        state.altitude["EGM96"] !== alt["EGM96"] &&
        state.altitude["WGS84"] !== alt["WGS84"]
      ) {
        setState((state: any) => ({
          ...state,
          altitude: { ...alt },
        }));
      }
    });
    //eslint-disable-next-line
  }, []);
  return props.children;
};

export default HandleAltitude;
