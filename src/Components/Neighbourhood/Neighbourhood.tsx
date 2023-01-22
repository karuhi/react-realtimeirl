import { useContext } from "react";
import { stateContext } from "Contexts/StateContext";

import { Transition } from "react-transition-group";

import isEmpty from "Functions/isEmpty";

import "./Neighbourhood.scss";

const Neighbourhood = () => {
  const [state] = useContext(stateContext);

  return (
    <Transition
      timeout={1000}
      mountOnEnter
      unmountOnExit
      in={!isEmpty(state.locationData)}
    >
      <div className="neighbourhood-container">
        <div className="neighbourhood">
          <hr />
          {state.neighbourhood || "Locating..."}
          <hr />
        </div>
      </div>
    </Transition>
  );
};

export default Neighbourhood;
