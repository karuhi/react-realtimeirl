import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const LatestTip = () => {
  const [state] = useContext(stateContext);
  const tipLatest = { ...state.streamElements['tip-latest'] };

  return (
    <div className="latest-tip">
      {state.streamElements['tip-latest'] && (
        <>
          <div className="se-heading">Latest Tip:</div>
          <div className="latest-tip-data">
            {`${tipLatest.name} - $${tipLatest.amount.toFixed(2)} `}
          </div>
        </>
      )}
      <br />
    </div>
  );
};

export default LatestTip;
