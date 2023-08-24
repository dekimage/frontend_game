import { useContext } from "react";
import { Context } from "@/context/store";
import Objective from "../Objective";

export const ObjectivesModal = () => {
  const [store, dispatch] = useContext(Context);
  const objectives = store.objectivesModal.data;

  return (
    <div>
      <div className="header">Objectives Progress:</div>
      {objectives.map((obj) => (
        <Objective
          fromNotification
          objective={obj}
          dispatch={dispatch}
          isUserPro={store.user.pro}
          key={obj.id}
        />
      ))}
      <div className="flex_center">
        <div
          className="btn btn-primary"
          onClick={() => dispatch({ type: "CLOSE_OBJECTIVES_MODAL" })}
        >
          Great!
        </div>
      </div>
    </div>
  );
};

export default ObjectivesModal;
