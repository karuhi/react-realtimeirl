import { stateContext } from "Contexts/StateContext";
import { useContext, useEffect } from "react";

//@ts-ignore
import createServiceFactory from "@mapbox/mapbox-sdk/services/geocoding";

const HandleNeighbourhood = (props: any) => {
  const [state, setState] = useContext(stateContext);
  const mbxGeocode = createServiceFactory({ accessToken: state.mapboxKey });

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
          "country",
          "region",
          "postcode",
          "district",
          "place",
          "locality",
          "neighborhood",
          "address",
          "poi",
        ])
          context[param] = response.body!.features.find(
            (feature: { [index: string]: string }) =>
              feature.place_type.includes(param)
          );
        context["japan"] = response.body!.features.find(
          (feature: { [index: string]: string }) =>
            feature.place_name.includes("Japan")
        );
        //eslint-disable-next-line
        const { country, region, postcode, district, place, locality, neighborhood, address, poi, japan } = context; // prettier-ignore
        // prettier-ignore
        if (japan && region && place && locality) {
            setState((state:any) => ({
              ...state,
              neighbourhood: poi ? `${poi.text}, ${locality.text}, ${place.text} - ${region.text}, ${country.properties.short_code.toUpperCase()}` : `${locality.text}, ${place.text} - ${region.text}, ${country.properties.short_code.toUpperCase()}`
            }))
          }
          else if (locality && country && !neighborhood) {
            setState((state:any) => ({
              ...state,
              neighbourhood: poi ? `${poi.text}, ${locality.text}, ${country.properties.short_code.toUpperCase()}`: `${locality.text} - ${country.properties.short_code.toUpperCase()}`,
            }));
          } 
          else if (neighborhood && locality && place) {
            setState((state:any) => ({
              ...state,
              neighbourhood: poi ? `${poi.text}, ${neighborhood.text}, ${locality.text} - ${place.text}, ${country.properties.short_code.toUpperCase()}` : `${neighborhood.text}, ${locality.text} - ${place.text}, ${country.properties.short_code.toUpperCase()}`,
            }));
          }
          else if (place) {
            setState((state:any) => ({
              ...state,
              neighbourhood: poi ? `${poi.text}, ${place.text}, ${country.properties.short_code.toUpperCase()}` : `${place.text}, ${country.properties.short_code.toUpperCase()}`,
            }));
          }
          else if (country && !place) {
            setState((state:any) => ({
              ...state,
              neighbourhood: poi ? `${poi.text}, ${country.place_name}` : `${country.place_name}`,
            }));
          }
        setState((state: any) => ({ ...state, geocode: { ...response.body } }));
      });
  };
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

  return props.children;
};

export default HandleNeighbourhood;
