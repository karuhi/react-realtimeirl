import StateContextProvider from 'Contexts/StateContext';

import Map from 'Components/Map/Map';
import Metrics from 'Components/Metrics/Metrics';
import Neighbourhood from 'Components/Neighbourhood/Neighbourhood';
import Rotator from 'Components/Rotator/Rotator';

import './App.scss';

function App() {
  return (
    <StateContextProvider>
      <Map />
      <Metrics />
      <Neighbourhood />
      <Rotator />
    </StateContextProvider>
  );
}

export default App;
