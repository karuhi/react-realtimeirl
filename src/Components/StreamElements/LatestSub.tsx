import { stateContext } from "Contexts/StateContext";
import { useContext } from "react";

const tier: any = {
  "1000": "Tier 1",
  "2000": "Tier 2",
  "3000": "Tier 3",
  prime: "Prime",
};

const LatestSub = () => {
  const [state] = useContext(stateContext);
  const subLatest = { ...state.streamElements["subscriber-latest"] };
  return (
    <div className="latest-sub">
      {state.streamElements["subscriber-latest"] && (
        <>
          <div className="se-heading">Latest Sub:</div>
          <div className="latest-sub-data">
            {`${subLatest.name} - ${subLatest.amount} ${
              subLatest.amount > 1 ? "months" : "month"
            } - (${tier[subLatest["tier"]]})`}
            <br />
          </div>
        </>
      )}
      <br />
    </div>
  );
};

export default LatestSub;
