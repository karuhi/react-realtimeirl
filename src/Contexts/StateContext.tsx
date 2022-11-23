import { createContext, useEffect, useRef, useState } from 'react';

import * as luxon from 'luxon';
import { forPullKey } from '@rtirl/api';

//@ts-ignore
import createServiceFactory from '@mapbox/mapbox-sdk/services/geocoding';

import isEmpty from 'Functions/isEmpty';

let [pullKey, mapboxKey, mapZoom, weatherKey, timezoneKey] = [
  '',
  '',
  '',
  '',
  '',
  '',
];

let debug = false;

const queryParams = new URLSearchParams(window.location.search);

mapboxKey = process.env.REACT_APP_MAPBOX_KEY || queryParams.get('mapboxKey') || ''; // prettier-ignore
mapZoom = queryParams.get('zoom') || '13'; // prettier-ignore
pullKey = process.env.REACT_APP_PULL_KEY || queryParams.get('pullKey') || ''; // prettier-ignore
timezoneKey = process.env.REACT_APP_TIMEZONE_KEY || queryParams.get('timezoneKey') || ''; // prettier-ignore
weatherKey = process.env.REACT_APP_OPENWEATHER_KEY || queryParams.get('weatherKey') || ''; // prettier-ignore
debug = queryParams.get('debug') ? true : false; // prettier-ignore

const imperial = queryParams.get('imperial');

const mbxGeocode = createServiceFactory({ accessToken: mapboxKey });

type Context = any;

export const stateContext = createContext<Context>({});

let sessionDistance = 0;

const StateContextProvider = (props: any) => {
  const [state, setState] = useState({
    debug: debug,
    timezoneKey: timezoneKey,
    mapboxKey: mapboxKey,
    mapZoom: mapZoom,
    pullKey: pullKey,
    weatherKey: weatherKey,
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
  });

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
    const ref = useRef('');
    useEffect(() => {
      ref.current = value;
    });
    state.debug &&
      !value &&
      console.warn('NO SESSION ID, TOTAL DISTANCE UNAVAILABLE');
    return ref.current;
  };

  const prevLocation = usePreviousLocation(state.location);
  const prevSessionId = usePreviousSessionId(state.sessionId);

  // Get neighbourhood data, format and update state
  const getNeighbourhood = () => {
    mbxGeocode
      .reverseGeocode({
        query: [state.location.longitude, state.location.latitude],
      })
      .send()
      .then((response: { [Response: string]: any }) => {
        let context: { [index: string]: any } = {};
        for (let param of [
          'country',
          'region',
          'postcode',
          'district',
          'place',
          'locality',
          'neighborhood',
          'address',
          'poi',
        ])
          context[param] = response.body!.features.find(
            (feature: { [index: string]: string }) =>
              feature.place_type.includes(param)
          );
        context['japan'] = response.body!.features.find(
          (feature: { [index: string]: string }) =>
            feature.place_name.includes('Japan')
        );
        //eslint-disable-next-line
        const { country, region, postcode, district, place, locality, neighborhood, address, poi, japan } = context; // prettier-ignore
        // prettier-ignore
        if (japan && region && place && locality) {
          setState((state) => ({
            ...state,
            neighbourhood: poi ? `${poi.text}, ${locality.text}, ${place.text} - ${region.text}, ${country.properties.short_code.toUpperCase()}` : `${locality.text}, ${place.text} - ${region.text}, ${country.properties.short_code.toUpperCase()}`
          }))
        }
        else if (locality && country && !neighborhood) {
          setState((state) => ({
            ...state,
            neighbourhood: poi ? `${poi.text}, ${locality.text}, ${country.properties.short_code.toUpperCase()}`: `${locality.text} - ${country.properties.short_code.toUpperCase()}`,
          }));
        } 
        else if (neighborhood && locality && place) {
          setState((state) => ({
            ...state,
            neighbourhood: poi ? `${poi.text}, ${neighborhood.text}, ${locality.text} - ${place.text}, ${country.properties.short_code.toUpperCase()}` : `${neighborhood.text}, ${locality.text} - ${place.text}, ${country.properties.short_code.toUpperCase()}`,
          }));
        }
        else if (place) {
          setState((state) => ({
            ...state,
            neighbourhood: poi ? `${poi.text}, ${place.text}, ${country.properties.short_code.toUpperCase()}` : `${place.text}, ${country.properties.short_code.toUpperCase()}`,
          }));
        }
        else if (country && !place) {
          setState((state) => ({
            ...state,
            neighbourhood: poi ? `${poi.text}, ${country.place_name}` : `${country.place_name}`,
          }));
        }
        setState((state) => ({ ...state, geocode: { ...response.body } }));
      });
  };

  // Fetch timezone offset from location data once populated
  const refreshTzOffset = () => {
    fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${state.timezoneKey}&format=json&by=position&lat=${state.location.latitude}&lng=${state.location.longitude}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setState((state) => ({ ...state, zoneId: data['zoneName'] }));
      });
  };

  // Add location listener - update state on location change
  useEffect(() => {
    forPullKey(state.pullKey).addLocationListener((location) => {
      if (location) {
        if (
          state.location.latitude !== location.latitude ||
          state.location.longitude !== location.longitude
        ) {
          setState((state) => ({
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

  // Get neighbourhood data from mapbox every 5 seconds
  useEffect(() => {
    const mapboxInterval = setInterval(() => {
      getNeighbourhood();
    }, 5000);
    return () => {
      clearInterval(mapboxInterval);
    };
    // eslint-disable-next-line
  }, [state.location, state.neighbourhood]);

  // Call refresh timezone offset function on location change if zoneId not already set
  useEffect(() => {
    if (state.location.latitude && !state.zoneId) {
      console.log('init useeffect refreshtz');
      refreshTzOffset();
    }
    // eslint-disable-next-line
  }, [state.location]);

  // Refresh timezone offset every 5 seconds
  useEffect(() => {
    const tzInterval = setInterval(() => {
      console.log('interval refreshtz');
      refreshTzOffset();
    }, 5000);
    return () => {
      clearInterval(tzInterval);
    };
    // eslint-disable-next-line
  }, [state.zoneId]);

  // Get date and time data once zoneId established, format and update state
  useEffect(() => {
    const lang = 'en';
    const date = 'ccc, MMM dd, yyyy';
    const time = 'HH:mm:ss';
    const datetime = 'ccc, MMM dd, yyyy | HH:mm:ss';
    if (!isEmpty(state.zoneId)) {
      const dateInterval = setInterval(() => {
        setState((state) => ({
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

  // Add speed listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addSpeedListener((speed) => {
      if (speed && state.speed !== speed) {
        setState((state) => ({
          ...state,
          speed: speed * 3.6,
        }));
      }
    });
    // eslint-disable-next-line
  }, []);

  // Add altitude listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addAltitudeListener((alt: any) => {
      if (
        !isEmpty(alt) &&
        state.altitude['EGM96'] !== alt['EGM96'] &&
        state.altitude['WGS84'] !== alt['WGS84']
      ) {
        setState((state) => ({
          ...state,
          altitude: { ...alt },
        }));
      }
    });
    //eslint-disable-next-line
  }, []);

  // Add heartrate listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addHeartRateListener((rate) => {
      if (rate && state.heartRate !== rate) {
        setState((state) => ({ ...state, heartRate: rate }));
      }
    });
    //eslint-disable-next-line
  }, []);

  // Array of cardinal directions for compass use
  let compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  // Add heading listener, update state with cardinal direction and bearing in degrees
  useEffect(() => {
    forPullKey(state.pullKey).addHeadingListener((heading) => {
      const cardinal = compass[(((heading + 22.5) % 360) / 45) | 0];
      if (
        state.headingCardinal !== cardinal ||
        state.headingDegrees !== heading
      ) {
        setState((state) => ({
          ...state,
          headingCardinal: cardinal,
          headingDegrees: heading ? heading : 0,
        }));
      }
    });
    //eslint-disable-next-line
  }, []);

  // Get weather updates every 5 seconds, update state
  useEffect(() => {
    console.warn('setinterval for weather triggered');
    const locationInterval = setInterval(() => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${state.location.latitude}&lon=${state.location.longitude}&appid=${state.weatherKey}`
      )
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setState((state) => ({ ...state, locationData: { ...json } }));
        });
      state.debug && console.log('weather refresh');
    }, 5000);
    return () => {
      clearInterval(locationInterval);
    };
    // eslint-disable-next-line
  }, []);

  // Add session ID listener - used for distance calc, update state
  useEffect(() => {
    forPullKey(state.pullKey).addSessionIdListener((sessionId) => {
      if (sessionId && sessionId !== state.sessionId) {
        state.debug && console.log(`SESSION ID ESTABLISHED: ${sessionId}`);
        setState((state) => ({
          ...state,
          sessionId: sessionId,
        }));
      }
    });
    //eslint-disable-next-line
  }, []);

  // Debug - show session ID in console and warn distance reset has occurred
  //eslint-disable-next-line
  useEffect(() => {
    if (prevSessionId && state.sessionId) {
      if (prevSessionId !== state.sessionId) {
        setState((state) => ({ ...state, totalDistance: 0 }));
        state.debug &&
          console.warn(`NEW SESSION ID: ${state.sessionId} - DISTANCE RESET`);
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
      sessionDistance += getDistanceFromLatLonInKm(
        state.location.latitude,
        state.location.longitude,
        prevLocation.latitude,
        prevLocation.longitude
      );
    }
    if (state.totalDistance !== sessionDistance) {
      setState((state) => ({ ...state, totalDistance: sessionDistance }));
      state.debug && console.log(`DISTANCE CHANGE: ${sessionDistance}`);
    }
  });

  return (
    <stateContext.Provider value={[state, setState]}>
      {props.children}
    </stateContext.Provider>
  );
};

export default StateContextProvider;
