import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const LatestCheer = () => {
  const [state] = useContext(stateContext);
  const cheerLatest = { ...state.streamElements['cheer-latest'] };

  return (
    <div className="latest-cheer">
      {state.streamElements['cheer-latest'] && (
        <>
          <div className="se-heading">Latest Cheer:</div>
          <div className="latest-cheer-data">
            {`${cheerLatest.name} - ${cheerLatest.amount} bits`}
          </div>
        </>
      )}
      <br />
    </div>
  );
};

export default LatestCheer;
