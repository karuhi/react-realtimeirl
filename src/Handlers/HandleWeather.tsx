import { stateContext } from 'Contexts/StateContext';
import { useContext, useEffect } from 'react';

const HandleWeather = (props: any) => {
  const [state, setState] = useContext(stateContext);

  // Get weather updates every 5 seconds, update state
  useEffect(() => {
    state.debug && console.warn('setinterval for weather triggered');
    const locationInterval = setInterval(() => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${state.location.latitude}&lon=${state.location.longitude}&appid=${state.weatherKey}`
      )
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setState((state: any) => ({ ...state, locationData: { ...json } }));
        });
      state.debug && console.log('weather refresh');
    }, 5000);
    return () => {
      clearInterval(locationInterval);
    };
    // eslint-disable-next-line
  }, []);
  return props.children;
};

export default HandleWeather;
