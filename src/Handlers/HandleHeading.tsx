import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

import { forPullKey } from "@rtirl/api";

const HandleHeading = (props: any) => {
  const [state, setState] = useContext(stateContext);

  // Array of cardinal directions for compass use
  let compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  // Add heading listener, update state with cardinal direction and bearing in degrees
  useEffect(() => {
    forPullKey(state.pullKey).addHeadingListener((heading) => {
      const cardinal = compass[(((heading + 22.5) % 360) / 45) | 0];
      if (
        state.headingCardinal !== cardinal ||
        state.headingDegrees !== heading
      ) {
        setState((state: any) => ({
          ...state,
          headingCardinal: cardinal,
          headingDegrees: heading ? heading : 0,
        }));
      }
    });
    //eslint-disable-next-line
  }, []);
  return props.children;
};

export default HandleHeading;
