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
  const [calcSpeed, setCalcSpeed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pastDistance, setPastDistance] = useState(state.totalDistance)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft + 1);
    }, 1000);
  },[]);

  useEffect(() => {
    const diff = state.totalDistance - pastDistance;
    let speed = diff/timeLeft*60*60;

    // Nan か Infinityなら前の速度を出す
    if (isNaN(speed)) speed = calcSpeed;
    if (speed === Infinity) speed = calcSpeed;
  
    setCalcSpeed(speed)
    setTimeLeft(0)
    setPastDistance(state.totalDistance)
  },[state.totalDistance])


  // console.log(timeLeft)

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
      
      <div className="container" style={{display:speed === -4 ? '' : 'none'}}>
        <div className="speed-text" style={{display:speed ? '' : 'none', paddingBottom: speedPad ? '8px' : ''}}>Speed: {state.imperial ? `${(state.speed / 1.609).toFixed()} mp/h` : `${(state.speed).toFixed()} km/h`}</div>
        <div className={`progress ${state.speed >= 40 ? "progress-infinite" : "progress-striped"}`}>
          <div className={state.speed >= 40 ? "progress-bar3" : "progress-bar"} style={{ width: `${state.speed < 40 ? state.speed*2.5 : 100}%`}}></div>
        </div>
      </div>
      <div className="container" style={{display:speed !== -4 ? '' : 'none'}}>
        <div className="speed-text" style={{display:speed ? '' : 'none', paddingBottom: speedPad ? '8px' : ''}}>Speed: {`${(calcSpeed).toFixed()} km/h`}</div>
        <div className={`progress ${calcSpeed >= 40 ? "progress-infinite" : "progress-striped"}`}>
          <div className={calcSpeed >= 40 ? "progress-bar3" : "progress-bar"} style={{ width: `${calcSpeed < 40 ? calcSpeed*2.5 : 100}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default OtherMetrics;
