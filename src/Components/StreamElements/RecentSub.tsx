import { stateContext } from "Contexts/StateContext";
import { useContext } from "react";

const tier: any = {
  "1000": "Tier 1",
  "2000": "Tier 2",
  "3000": "Tier 3",
  prime: "Prime",
};

const RecentSub = () => {
  const [state] = useContext(stateContext);
  return (
    <div className="recent-sub">
      <div className="se-heading">Recent Subs:</div>
      <div className="recent-sub-data">
        {state.streamElements["subscriber-recent"].map(
          (sub: any, index: number) => {
            if (index > 0 && index <= 4) {
              return (
                <div
                  className="recent-subs"
                  key={`SUB-${sub["name"]}-${index}`}
                >
                  {sub["name"]} - {sub["amount"]}{" "}
                  {sub["amount"] > 1 ? "months" : "month"}{" "}
                  {` - (${tier[sub["tier"]]})`}
                </div>
              );
            } else return null;
          }
        )}
      </div>
      <br />
    </div>
  );
};

export default RecentSub;
