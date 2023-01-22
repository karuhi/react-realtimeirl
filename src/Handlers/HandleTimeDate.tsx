import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

import * as luxon from "luxon";

import isEmpty from "Functions/isEmpty";

const HandleTimeDate = (props: any) => {
  const [state, setState] = useContext(stateContext);

  // Fetch timezone offset from location data once populated
  const refreshTzOffset = () => {
    fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${state.timezoneKey}&format=json&by=position&lat=${state.location.latitude}&lng=${state.location.longitude}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setState((state: any) => ({ ...state, zoneId: data["zoneName"] }));
      });
  };

  // Get date and time data once zoneId established, format and update state
  useEffect(() => {
    const lang = "en";
    const date = "ccc, MMM dd, yyyy";
    const time = "HH:mm:ss";
    const datetime = "ccc, MMM dd, yyyy | HH:mm:ss";
    if (!isEmpty(state.zoneId)) {
      const dateInterval = setInterval(() => {
        setState((state: any) => ({
          ...state,
          time: luxon.DateTime.now()
            .setZone(state.zoneId)
            .setLocale(lang)
            .toFormat(time),
          date: luxon.DateTime.now()
            .setZone(state.zoneId)
            .setLocale(lang)
            .toFormat(date),
          datetime: luxon.DateTime.now()
            .setZone(state.zoneId)
            .setLocale(lang)
            .toFormat(datetime),
        }));
      }, 1000);
      return () => {
        clearInterval(dateInterval);
      };
    }
    // eslint-disable-next-line
  }, [state.zoneId]);

  // Call refresh timezone offset function on location change if zoneId not already set
  useEffect(() => {
    if (state.location.latitude && !state.zoneId) {
      state.debug && console.log("init use effect refreshtz");
      refreshTzOffset();
    }
    // eslint-disable-next-line
  }, [state.location]);

  // Refresh timezone offset every 5 seconds
  useEffect(() => {
    const tzInterval = setInterval(() => {
      state.debug && console.log("setinterval refreshtz");
      refreshTzOffset();
    }, 5000);
    return () => {
      clearInterval(tzInterval);
    };
    // eslint-disable-next-line
  }, [state.zoneId]);
  return props.children;
};

export default HandleTimeDate;
