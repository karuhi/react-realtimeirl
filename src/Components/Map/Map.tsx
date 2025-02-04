import { useContext, useEffect, useRef, useState } from 'react';
import { stateContext } from 'Contexts/StateContext';

import { MapContainer, TileLayer } from 'react-leaflet';
//@ts-ignore
import { useMap } from 'react-leaflet/hooks';

import { LatLngExpression } from 'leaflet';

import Timedate from 'Components/Timedate/Timedate';

import themeChooser from 'Functions/themeChooser';

import './Map.scss';

const queryParams: { [Value: string]: any } = new URLSearchParams(window.location.search); // prettier-ignore

const attribution = parseInt(queryParams.get('attribution'));
const mapEnabled = parseInt(queryParams.get('map'));
const themeInput = queryParams.get('theme') || '';

const leafletProviderKey = process.env.REACT_APP_LEAFLET_PROVIDER_KEY || queryParams.get('leafletProviderKey') || ''; // prettier-ignore

interface IProps {
  animateRef: { current: {} };
  center: LatLngExpression;
  zoom: number;
}

const MapPosition = ({ animateRef, center, zoom }: IProps) => {
  const map = useMap();
  map.setView(center, zoom, {
    animate: animateRef.current,
  });
  return null;
};

function Map() {
  const [state] = useContext(stateContext);
  const [theme, setTheme] = useState(
    themeChooser(themeInput, leafletProviderKey)
  );

  const [center, setCenter] = useState<LatLngExpression>([
    state.location.latitude,
    state.location.longitude,
  ]);

  const [zoom, setZoom] = useState(state.mapZoom);
  const animateRef = useRef(true);

  useEffect(() => {
    setTheme(themeChooser(themeInput, leafletProviderKey));
  }, []);

  useEffect(() => {
    setCenter([state.location.latitude, state.location.longitude]);
  }, [state.location.latitude, state.location.longitude]);

  useEffect(() => {
    setZoom(state.mapZoom);
  }, [state.mapZoom]);

  return (
    theme && (
      <div className="map-container">
        <Timedate />
        {mapEnabled ? (
          <MapContainer
            center={center}
            zoom={zoom}
            zoomControl={false}
            attributionControl={attribution ? true : false}
          >
            <TileLayer url={theme.url} {...theme.options} />
            <MapPosition animateRef={animateRef} center={center} zoom={zoom} />
            <div className="marker" />
          </MapContainer>
        ) : (
          <div />
        )}
      </div>
    )
  );
}

export default Map;
