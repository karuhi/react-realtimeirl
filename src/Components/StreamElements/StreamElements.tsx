import { useEffect, useState } from 'react';

import { useSpring, animated } from 'react-spring';

import LatestCheer from './LatestCheer';
import LatestFollow from './LatestFollow';
import LatestSub from './LatestSub';
import LatestTip from './LatestTip';

import RecentCheer from './RecentCheer';
import RecentFollow from './RecentFollow';
import RecentSub from './RecentSub';
import RecentTip from './RecentTip';

import './StreamElements.scss';

const StreamElements = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [element, setElement] = useState(0);

  const animConfig = {
    mass: 30,
    tension: 100,
    friction: 50,
    precision: 0.01,
    velocity: 0,
  };
  const inProps = useSpring({
    config: animConfig,
    opacity: element ? 0 : 1,
  });
  const outProps = useSpring({
    config: animConfig,
    opacity: element ? 1 : 0,
  });

  const latestSubTip = [
    <animated.div style={inProps}>
      <LatestSub />
    </animated.div>,
    <animated.div style={outProps}>
      <LatestTip />
    </animated.div>,
  ];
  const latestFollowCheer = [
    <animated.div style={inProps}>
      <LatestFollow />
    </animated.div>,
    <animated.div style={outProps}>
      <LatestCheer />
    </animated.div>,
  ];
  const recentSubTip = [
    <animated.div style={inProps}>
      <RecentSub />
    </animated.div>,
    <animated.div style={outProps}>
      <RecentTip />
    </animated.div>,
  ];
  const recentFollowCheer = [
    <animated.div style={inProps}>
      <RecentFollow />
    </animated.div>,
    <animated.div style={outProps}>
      <RecentCheer />
    </animated.div>,
  ];

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
    if (!timeLeft) {
      setTimeLeft(10);
      setElement(element ? 0 : 1);
    }
  }, [timeLeft, element]);

  return (
    <div className="streamelements-container">
      {latestSubTip[element]}
      {latestFollowCheer[element]}
      {recentSubTip[element]}
      {recentFollowCheer[element]}
    </div>
  );
};

export default StreamElements;
