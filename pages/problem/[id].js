import { useQuery } from "@apollo/react-hooks";

import { useRouter } from "next/router";

import Card from "../../components/Card";

import Link from "next/link";
import _ from "lodash";
// import styles from "../../styles/Problem.module.scss";
import ReactMarkdown from "react-markdown";
import { Action } from "../../components/cardPageComps";
import CardsMapper from "../../components/CardsMapper";

import NavBar from "../../components/NavBar";
import ExpandableComponent from "../../components/ExpandableComponent";
import { normalize } from "../../utils/calculations";
import { joinCards } from "../../utils/joins";
import { Course } from "../../components/shopComps";

import { GET_PROBLEM_ID } from "../../GQL/query";
import { Problem } from "../problems";

import iconSource from "../../assets/source.svg";
import iconProgram from "../../assets/programs.svg";
import iconShortTerm from "../../assets/short-term.svg";
import iconLongTerm from "../../assets/long-term.svg";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// const AlternateNames = ({ otherNames }) => {
//   return (
//     <ul>
//       {otherNames.split(",").map((name, i) => (
//         <li key={i} className={styles.alternateName}>
//           {name}
//         </li>
//       ))}
//     </ul>
//   );
// };

const ActionsMapper = ({ actions, type }) => {
  let filteredActions = actions;

  return (
    <div>
      {filteredActions.map((a, i) => (
        <Action action={a} key={i} parent="problem" />
      ))}
    </div>
  );
};

const ProblemPageView = ({ problem }) => {
  const {
    id,
    name,
    other_names,
    source,
    expected_time_type,
    expected_time_amount,
    actions,
    cards,
    course,
    realm,
  } = problem;

  const router = useRouter();
  return (
    <div>
      <div onClick={() => router.back()}>
        <ion-icon name="chevron-back-outline"></ion-icon>
      </div>
      <Problem problem={problem} isInside />

      {/* <ExpandableComponent
        name={"Source of Problem:"}
        icon={iconSource}
        children={
          <div>
            <ReactMarkdown children={source} />
          </div>
        }
      /> */}
      <ExpandableComponent
        name={"Instant Solutions"}
        tag={"free"}
        icon={iconShortTerm}
        children={<ActionsMapper actions={actions} />}
      />
      <ExpandableComponent
        name={"Long-Term Solutions"}
        tag={"free"}
        icon={iconLongTerm}
        children={<CardsMapper cards={cards} />}
      />
      {/* <ExpandableComponent
        name={"Similar Problems:"}
        url={`${baseUrl}/similar.png`}
        children={<AlternateNames otherNames={other_names} />}
      /> */}
      {/* <ExpandableComponent
        name={"Program to solve this problem"}
        icon={iconProgram}
        children={<Course course={course} />}
      /> */}
    </div>
  );
};

const ProblemPage = () => {
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_PROBLEM_ID, {
    variables: { id: router.query.id },
  });

  const gql_data = data && normalize(data);

  return (
    <div className="background_dark">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {gql_data && (
          <div>
            <ProblemPageView problem={gql_data.problem} />
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default ProblemPage;
