import { stateContext } from 'Contexts/StateContext';
import { useContext } from 'react';

const RecentFollow = () => {
  const [state] = useContext(stateContext);
  return (
    <div className="recent-follow">
      <div className="se-heading">Recent Followers:</div>
      <div className="recent-follow-data">
        {state.streamElements['follower-recent'].map(
          (follow: any, index: number) => {
            if (index > 0 && index <= 4) {
              return (
                <div
                  className="recent-follows"
                  key={`FOLLOW-${follow['name']}-${index}`}
                >
                  {' '}
                  {follow['name']}{' '}
                </div>
              );
            } else return null;
          }
        )}
      </div>
    </div>
  );
};

export default RecentFollow;
