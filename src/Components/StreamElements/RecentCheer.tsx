import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const RecentCheer = () => {
  const [state] = useContext(stateContext);

  return (
    <div className="recent-cheer">
      {state.streamElements['cheer-recent'] && (
        <>
          <div className="se-heading">Recent Cheers:</div>
          <div className="recent-cheer-data">
            {state.streamElements['cheer-recent'].map(
              (cheer: any, index: number) => {
                if (index > 0 && index <= 4) {
                  return (
                    <div key={index}>
                      {`${cheer.name} - ${cheer.amount} bits `}
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

export default RecentCheer;
