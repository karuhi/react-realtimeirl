import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect, useState } from "react";
//@ts-ignore
import { SvgLoader } from "react-svgmt";

import "./Metrics.scss";

const queryParams: { [Value: string]: any } = new URLSearchParams(window.location.search); // prettier-ignore
const heartrate = parseInt(queryParams.get("heartrate"));
const altitude = parseInt(queryParams.get("altitude"));
const speed = parseInt(queryParams.get("speed"));
const distance = parseInt(queryParams.get("distance"));
const heading = parseInt(queryParams.get("heading"));
const metrics = parseInt(queryParams.get("metrics"));

// prettier-ignore
const OtherMetrics = () => {
  const [speedPad, setSpeedPad] = useState(false);
  useEffect(() => {
    if (heading || distance) {
      setSpeedPad(true);
    }
    // eslint-disable-next-line
  }, [])
  const [state] = useContext(stateContext);
  state.speed = 25;
  return (
    <div className="metrics-container" style={{display:metrics ? '' : 'none'}}>
      <div className="heading-text" style={{display:heading ? '' : 'none'}}>Heading:&nbsp;     
        <div className="compass-icon">
          <SvgLoader 
            path={`assets/compass.svg`}
            strokeWidth="12px"
            style={{transform: `rotate(${state.headingDegrees}deg)`}}
          />
        </div>
      </div>
      <div className="heart-text" style={{display:heartrate ? '' : 'none'}}>{state.heartRate === 0 ? `Heartrate: ${state.heartRate} bpm` : ''}</div>
      <div className="altitude-text" style={{display:altitude ? '' : 'none'}}>Altitude: {state.imperial ? `${(Math.abs((state.altitude['EGM96'] - state.altitude['WGS84']) / 2 ) * 3.281).toFixed(0)} ft` : `${Math.abs((state.altitude['EGM96'] - state.altitude['WGS84']) / 2 ).toFixed(0)} m`}</div>
      <div className="distance-text" style={{display:distance ? '' : 'none'}}>{state.imperial ? `Total distance: ${(state.totalDistance / 1.609).toFixed(2)} mi` : `Distance: ${(state.totalDistance).toFixed(2)} km`}</div>
      <div className="container">
        <div className="speed-text" style={{display:speed ? '' : 'none', paddingBottom: speedPad ? '8px' : ''}}>Speed: {state.imperial ? `${(state.speed / 1.609).toFixed()} mp/h` : `${(state.speed).toFixed()} km/h`}</div>
        <div className={`progress ${state.speed >= 40 ? "progress-infinite" : "progress-striped"}`}>
          <div className={state.speed >= 40 ? "progress-bar3" : "progress-bar"} style={{ width: `${state.speed*2.5}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default OtherMetrics;
