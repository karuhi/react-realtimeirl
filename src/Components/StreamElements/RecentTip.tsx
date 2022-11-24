import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const RecentTip = () => {
  const [state] = useContext(stateContext);
  return (
    <div className="recent-tip">
      {state.streamElements['tip-recent'] && (
        <>
          <div className="se-heading">Recent Tips:</div>
          <div className="recent-tip-data">
            {state.streamElements['tip-recent'].map(
              (tip: any, index: number) => {
                if (index > 0 && index <= 4) {
                  return (
                    <div key={index}>
                      {`${tip.name} - $${tip.amount.toFixed(2)} `}
                    </div>
                  );
                } else return null;
              }
            )}
          </div>
        </>
      )}
      <br />
    </div>
  );
};

export default RecentTip;
