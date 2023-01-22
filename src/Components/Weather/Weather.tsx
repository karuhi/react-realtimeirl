import { stateContext } from "Contexts/StateContext";
import React, { useContext } from "react";

//@ts-ignore
import { SvgLoader } from "react-svgmt";

import isEmpty from "Functions/isEmpty";

import "./Weather.scss";

//prettier-ignore
const Weather = () => {
  const [state] = useContext(stateContext);

  const icon = `assets/${state?.locationData?.weather?.[0]?.icon}.svg`;
  const max = `assets/cloud-arrow-up.svg`
  const min = `assets/cloud-arrow-down.svg`

  return (
    <React.Suspense fallback={<div/>}>
      {!isEmpty(state.locationData) && (
        <>
        <div className="conditions">
          {state.locationData.weather[0].main} /{' '}
          {state.locationData.weather[0].description}
        </div>
          <div className="min-max">
          <div className="weather-icon">
            <SvgLoader
              path={icon}
              className="icon"
              fill="white"
              stroke="black"
              strokeWidth="8px"
            />
            <br />
          </div>
            <br />
            <div className="min-icon">
            <SvgLoader 
            path={min}
            className="icon"
            fill="white"
            stroke="black"
            strokeWidth="12px"
            />
            </div>
            &nbsp;
            {state.imperial ? `${(((state.locationData.main.temp_min) * 9 / 5 ) + 32).toFixed(1)} °F ` : `${(state.locationData.main.temp_min).toFixed(1)} °C `}
            -&nbsp;
            <div className="max-icon">
            <SvgLoader 
            path={max}
            className="icon"
            fill="white"
            stroke="black"
            strokeWidth="12px"
            />
            </div>
            &nbsp;
            {state.imperial ? `${(((state.locationData.main.temp_max) * 9 / 5 ) + 32).toFixed(1)} °F` : `${(state.locationData.main.temp_max).toFixed(1)} °C`}
          </div>
          <div className="current-weather">
            Current: {state.imperial ? `${(((state.locationData.main.temp) * 9 / 5 ) + 32).toFixed(1)} °F` : `${(state.locationData.main.temp).toFixed(1)} °C`}
            <br />
            Feels like: {state.imperial ? `${(((state.locationData.main.feels_like) * 9 / 5 ) + 32).toFixed(1)} °F` : `${(state.locationData.main.feels_like).toFixed(1)} °C`}
        </div>
        </>)}
      </React.Suspense>
  );
};

export default Weather;
