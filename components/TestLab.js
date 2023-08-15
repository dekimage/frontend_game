import { ALLOWED_EMAILS } from "@/data/config";

const { resetUser } = require("@/actions/action");
const { Context } = require("@/context/store");
const { useContext } = require("react");

const TestLab = ({}) => {
  const [store, dispatch] = useContext(Context);
  if (!ALLOWED_EMAILS.includes(store.user.email)) {
    return null;
  }
  return (
    <div
      className="flex_center"
      style={{
        position: "fixed",
        top: "4rem",
        left: "1rem",
        zIndex: "10000000",
      }}
    >
      <div onClick={() => resetUser(dispatch)} className="btn">
        <ion-icon name="refresh-outline"></ion-icon>
      </div>
    </div>
  );
};

export default TestLab;
