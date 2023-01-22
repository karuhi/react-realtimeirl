import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect, useRef, useState } from "react";

import { forPullKey } from "@rtirl/api";

const HandleDistance = (props: any) => {
  const [state, setState] = useContext(stateContext);
  const [sessionDistance, setSessionDistance] = useState(0);

  // Custom hook with ref for previous value - used in distance calculation
  const usePreviousLocation = (value: {
    latitude: number;
    longitude: number;
  }): any => {
    const ref = useRef({ latitude: 0, longitude: 0 });
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  // Custom hook with ref for previous session ID - used in distance calculation
  const usePreviousSessionId = (value: string): string => {
    const ref = useRef("");
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevLocation = usePreviousLocation(state.location);
  const prevSessionId = usePreviousSessionId(state.sessionId);
  // Add session ID listener - used for distance calc, update state
  useEffect(() => {
    forPullKey(state.pullKey).addSessionIdListener((sessionId) => {
      if (sessionId && sessionId !== state.sessionId) {
        state.debug && console.log(`SESSION ID ESTABLISHED: ${sessionId}`);
        setState((state: any) => ({
          ...state,
          sessionId: sessionId,
        }));
      }
    });
    //eslint-disable-next-line
  }, []);

  //eslint-disable-next-line
  useEffect(() => {
    if (prevSessionId && state.sessionId) {
      if (prevSessionId !== state.sessionId) {
        setState((state: any) => ({ ...state, totalDistance: 0 }));
      }
    }
  });

  // Get distance between pairs of lat/lon
  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  // Return radians from degrees
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Calculate distance changes, update state
  // eslint-disable-next-line
  useEffect(() => {
    if (
      prevLocation.latitude &&
      prevLocation.longitude &&
      state.location.latitude &&
      state.location.longitude &&
      state.sessionId
    ) {
      setSessionDistance(
        sessionDistance +
          getDistanceFromLatLonInKm(
            state.location.latitude,
            state.location.longitude,
            prevLocation.latitude,
            prevLocation.longitude
          )
      );
    }
    if (state.totalDistance !== sessionDistance) {
      setState((state: any) => ({ ...state, totalDistance: sessionDistance }));
      state.debug && console.log(`DISTANCE CHANGE: ${sessionDistance}`);
    }
  });
  return props.children;
};

export default HandleDistance;
