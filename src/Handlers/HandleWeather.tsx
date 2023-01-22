import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

const HandleWeather = (props: any) => {
  const [state, setState] = useContext(stateContext);
  const getWeather = () => {
    state.debug && console.log("weather refresh");
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${state.location.latitude}&lon=${state.location.longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${state.weatherKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setState((state: any) => ({
          ...state,
          locationData: data,
        }));
      });
  };
  // Get weather updates every 5 seconds, update state
  useEffect(() => {
    state.debug && console.warn("setinterval for weather triggered");
    const locationInterval = setInterval(() => {
      getWeather();
    }, 5000);
    return () => {
      clearInterval(locationInterval);
    };
    // eslint-disable-next-line
  }, [state.location]);
  return props.children;
};

export default HandleWeather;
