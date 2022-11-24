import { stateContext } from 'Contexts/StateContext';
import React, { useContext, useEffect, useState } from 'react';

import { Transition } from 'react-transition-group';
import { useSpring, animated } from 'react-spring';

import isEmpty from 'Functions/isEmpty';

import './Rotator.scss';

import Weather from 'Components/Weather/Weather';
import StreamElements from 'Components/StreamElements/StreamElements';

//* This component rotates between display of weather/streamelements data
//prettier-ignore
const Rotator = () => {
  const [state] = useContext(stateContext);
  const [show, setShow] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [pendingVisible, setPendingVisible] = useState(false);
  const [component, setComponent] = useState(0)

  const springConfig = { mass: 4, tension: 400, friction: 80, velocity: 10 };
  const rotatorProps = useSpring({
    config: springConfig,
    transform: show ? `translate(0px, 0px)` : `translate(400px, 0px)`,
    from: { 
      transform: show ? 'translate(400px, 0px)' : 'translate(0px, 0px)',
    },
  })

  //! Array of components to be displayed
  const components = [<Weather/>, <StreamElements/>]

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(0);
    }
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (
      !pendingVisible
    ) {
      if (!timeLeft && !pendingVisible) {
        setPendingVisible(true);
        setTimeLeft(40);
      }
    }
  }, [pendingVisible, timeLeft]);

  useEffect(() => {
    if (pendingVisible && !timeLeft) {
      setPendingVisible(true);
      setShow(true);
      setTimeLeft(20);
    }
  }, [pendingVisible, timeLeft]);

  useEffect(() => {
    if (
      pendingVisible &&
      show &&
      !timeLeft
    ) {
      setPendingVisible(false);
      setShow(false);
      setTimeLeft(0);
      //! setComponent to switch between components in the array
      setTimeout(() => {
        setComponent(component ? 0 : 1)
      }, 2000);
    }
  }, [pendingVisible, show, timeLeft, component]);

  return (
    <React.Suspense fallback={<div/>}>
      {!isEmpty(state.locationData) && (
        <Transition timeout={1000} mountOnEnter unmountOnExit in={show}>
          <animated.div className='rotator-container' style={rotatorProps}>
            {state.streamElementsSubscribed ? components[component] : <Weather/>}
          </animated.div>
        </Transition>
      )}
      </React.Suspense>
  );
};

export default Rotator;
