import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

import { forPullKey } from "@rtirl/api";

const HandleLocation = (props: any) => {
  const [state, setState] = useContext(stateContext);

  // Add location listener - update state on location change
  useEffect(() => {
    forPullKey(state.pullKey).addLocationListener((location) => {
      if (location) {
        if (
          state.location.latitude !== location.latitude ||
          state.location.longitude !== location.longitude
        ) {
          setState((state: any) => ({
            ...state,
            location: {
              ...location,
            },
          }));
        }
      }
    });
    // eslint-disable-next-line
  }, []);
  return props.children;
};

export default HandleLocation;
