import { stateContext } from "Contexts/StateContext";
import { useContext } from "react";
import { ReactFitty } from "react-fitty";

import "./Timedate.scss";

const Timedate = () => {
  const [state] = useContext(stateContext);
  return (
    <div className="time-container">
      <ReactFitty className="time">{state.datetime}</ReactFitty>
    </div>
  );
};

export default Timedate;
