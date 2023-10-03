import { useContext, useEffect } from "react";
import { Context } from "@/context/store";
import Objective from "../Objective";

export const ObjectivesModal = () => {
  const [store, dispatch] = useContext(Context);
  const objectives = store.objectivesModal.data;

  useEffect(() => {
    return () => {
      dispatch({ type: "CLOSE_OBJECTIVES_MODAL" });
    };
  }, []);

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
          Back to Card
        </div>
      </div>
    </div>
  );
};

export default ObjectivesModal;
