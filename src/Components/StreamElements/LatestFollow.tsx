import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const LatestFollow = () => {
  const [state] = useContext(stateContext);
  return (
    <div className="latest-follow">
      <div className="se-heading">Latest Follow:</div>
      {state.streamElements['follower-latest'] && (
        <div className="latest-follow-data">
          {`${state.streamElements['follower-latest'].name}`}
        </div>
      )}
      <br />
    </div>
  );
};

export default LatestFollow;
