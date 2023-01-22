import { stateContext } from 'Contexts/StateContext';
import { useContext, useEffect } from 'react';

import { forPullKey } from '@rtirl/api';

const HandleSpeed = (props: any) => {
  const [state, setState] = useContext(stateContext);

  // Add speed listener, update state
  useEffect(() => {
    forPullKey(state.pullKey).addSpeedListener((speed) => {
      if (speed && state.speed !== speed) {
        setState((state: any) => ({
          ...state,
          speed: speed * 3.6,
        }));
      }
    });
    // eslint-disable-next-line
  }, []);
  return props.children;
};

export default HandleSpeed;
