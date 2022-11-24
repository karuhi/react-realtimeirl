import { createContext, useState } from 'react';

import HandleStreamElements from 'Handlers/HandleStreamElements';
import HandleHeading from 'Handlers/HandleHeading';
import HandleDistance from 'Handlers/HandleDistance';
import HandleWeather from 'Handlers/HandleWeather';
import HandleAltitude from 'Handlers/HandleAltitude';
import HandleHeartrate from 'Handlers/HandleHeartrate';
import HandleNeighbourhood from 'Handlers/HandleNeighbourhood';
import HandleLocation from 'Handlers/HandleLocation';
import HandleSpeed from 'Handlers/HandleSpeed';
import HandleTimeDate from 'Handlers/HandleTimeDate';

let [pullKey, mapboxKey, mapZoom, weatherKey, timezoneKey, streamElementsKey] =
  ['', '', '', '', '', ''];

let debug = false;

const queryParams = new URLSearchParams(window.location.search);

mapboxKey = process.env.REACT_APP_MAPBOX_KEY || queryParams.get('mapboxKey') || ''; // prettier-ignore
mapZoom = queryParams.get('zoom') || '13'; // prettier-ignore
pullKey = process.env.REACT_APP_PULL_KEY || queryParams.get('pullKey') || ''; // prettier-ignore
timezoneKey = process.env.REACT_APP_TIMEZONE_KEY || queryParams.get('timezoneKey') || ''; // prettier-ignore
weatherKey = process.env.REACT_APP_OPENWEATHER_KEY || queryParams.get('weatherKey') || ''; // prettier-ignore
debug = queryParams.get('debug') ? true : false; // prettier-ignore
streamElementsKey = process.env.REACT_APP_STREAMELEMENTS_KEY || queryParams.get('streamElementsKey') || ''; // prettier-ignore

const imperial = queryParams.get('imperial');

type Context = any;

export const stateContext = createContext<Context>({});

const StateContextProvider = (props: any) => {
  //! Global state object - provided to other components as a context
  const [state, setState] = useState({
    debug: debug,
    timezoneKey: timezoneKey,
    mapboxKey: mapboxKey,
    mapZoom: mapZoom,
    pullKey: pullKey,
    weatherKey: weatherKey,
    streamElementsKey: streamElementsKey,
    streamElementsSubscribed: false,
    zoneId: '',
    prevLocation: {
      latitude: 0,
      longitude: 0,
    },
    location: {
      latitude: 0,
      longitude: 0,
    },
    geocode: {},
    locationData: {},
    neighbourhood: '',
    date: '',
    time: '',
    datetime: '',
    speed: 0,
    altitude: {
      EGM96: 0,
      WGS84: 0,
    },
    headingCardinal: '',
    headingDegrees: 0,
    heartRate: 0,
    totalDistance: 0,
    sessionId: '',
    imperial: imperial || '',
    streamElements: {
      subscribed: false,
      'subscriber-latest': {
        name: '',
        amount: 0,
        tier: '1000',
        message: null,
        sender: null,
        gifted: null,
      },
      'follower-latest': { name: '' },
      'subscriber-recent': [{ name: '', amount: 0 }],
      'follower-recent': [{ name: '' }],
    },
  });

  return (
    <stateContext.Provider value={[state, setState]}>
      <HandleAltitude />
      <HandleDistance />
      <HandleHeading />
      <HandleHeartrate />
      <HandleLocation />
      <HandleNeighbourhood />
      <HandleSpeed />
      <HandleStreamElements />
      <HandleTimeDate />
      <HandleWeather />
      {props.children}
    </stateContext.Provider>
  );
};

export default StateContextProvider;
