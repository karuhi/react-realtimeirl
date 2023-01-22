import { useContext, useEffect, useState } from 'react';
import { stateContext } from 'Contexts/StateContext';

import { Transition } from 'react-transition-group';

import isEmpty from 'Functions/isEmpty';

import './Neighbourhood.scss';

const Neighbourhood = () => {
  const [state] = useContext(stateContext);

  const [pastArray, setPastArray] = useState([]);
  const [neighbourText, setNeighbourText] = useState('');

  //TODO - 近くの名称が変わった際に、変わった部分だけアニメーションして変更するようにする
  //NOTE - https://codepen.io/alvarotrigo/pen/ZEJgqLN
  const animateNighbourhood = () => {
    const neighbourhood = state.neighbourhood;
    const neighArray = neighbourhood.split(',');
    console.log(neighArray, pastArray);
    setPastArray(neighArray);
    setNeighbourText(state.neighbourhood);
  };

  useEffect(() => {
    console.log('locate changed');
    animateNighbourhood();
  }, [state.neighbourhood]);

  return (
    <Transition
      timeout={1000}
      mountOnEnter
      unmountOnExit
      in={!isEmpty(state.locationData)}
    >
      <div className="neighbourhood-container">
        <div className="neighbourhood">
          <hr />
          {neighbourText || 'Locating...'}
          <hr />
        </div>
      </div>
    </Transition>
  );
};

export default Neighbourhood;
