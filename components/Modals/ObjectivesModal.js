import { useContext, useEffect } from "react";
import { Context } from "@/context/store";
import Objective from "../Objective";
import { useRouter } from "next/router";

export const ObjectivesModal = () => {
  const [store, dispatch] = useContext(Context);
  const objectives = store.objectivesModal.data;

  useEffect(() => {
    return () => {
      dispatch({ type: "CLOSE_OBJECTIVES_MODAL" });
    };
  }, []);

  const router = useRouter();

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
          className="btn btn-primary mr5"
          onClick={() => dispatch({ type: "CLOSE_OBJECTIVES_MODAL" })}
        >
          Back to Card
        </div>
        <div className="btn btn-primary" onClick={() => router.push("/")}>
          Go to Objectives
        </div>
      </div>
    </div>
  );
};

export default ObjectivesModal;
