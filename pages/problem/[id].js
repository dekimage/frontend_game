import { BackButton } from "../../components/reusableUI";
import CardsMapper from "../../components/CardsMapper";
import ExpandableComponent from "../../components/ExpandableComponent";
import { GET_PROBLEM_ID } from "../../GQL/query";
import NavBar from "../../components/NavBar";
import { Problem } from "../problems";
import _ from "lodash";
import iconShortTerm from "../../assets/short-term.svg";
import { withUser } from "../../Hoc/withUser";

const ProblemPageView = ({ problem }) => {
  const { cards } = problem;

  return (
    <div>
      <BackButton routeDynamic={""} routeStatic={""} isBack />
      <Problem problem={problem} isInside />

      <ExpandableComponent
        name={"Potential Solutions"}
        tag={"free"}
        icon={iconShortTerm}
        children={<CardsMapper cards={cards} />}
      />
    </div>
  );
};

const ProblemPage = (props) => {
  const { data } = props;

  return (
    <div className="background_dark">
      <div className="section">
        <div>
          <ProblemPageView problem={data.problem} />
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default withUser(ProblemPage, GET_PROBLEM_ID, true);
