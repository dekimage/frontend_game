const { resetUser } = require("@/actions/action");
const { Context } = require("@/context/store");
const { useContext } = require("react");

const TestLab = ({}) => {
  const [store, dispatch] = useContext(Context);
  return (
    <div
      className="flex_center"
      style={{ height: "100px", backgroundColor: "black" }}
    >
      <div onClick={() => resetUser(dispatch)} className="btn btn-primary">
        RESET
      </div>
    </div>
  );
};

export default TestLab;
