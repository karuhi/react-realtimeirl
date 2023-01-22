import { stateContext } from 'Contexts/StateContext';
import React, { useContext } from 'react';

import isEmpty from 'Functions/isEmpty';

import './Rotator.scss';

import Weather from 'Components/Weather/Weather';

//* This component rotates between display of weather/streamelements data
//prettier-ignore
const Rotator = () => {
  const [state] = useContext(stateContext);

  return (
    <React.Suspense fallback={<div/>}>
      {!isEmpty(state.locationData) && (
          <div className='rotator-container'>
            <Weather/>
          </div>
      )}
      </React.Suspense>
  );
};

export default Rotator;
