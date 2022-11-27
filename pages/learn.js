import { useQuery } from "@apollo/react-hooks";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { CardType } from "../components/Card";
import { Realm } from "../components/Realm";
import Cookie from "js-cookie";
import { calcRealmProgress, normalize } from "../utils/calculations";
import { ProblemsBox } from "../components/todayComp";
import styles from "../styles/Learn.module.scss";

import { GET_REALMS } from "../GQL/query";
import { GET_USER_STATS } from "../GQL/query";

const USER_ID = Cookie.get("userId");

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  const gql_data = data && normalize(data);

  const { data: usercardPreData } = useQuery(GET_USER_STATS, {
    variables: { id: USER_ID },
  });
  const usercardsData = usercardPreData && normalize(usercardPreData);

  const realmHash = usercardsData?.user?.usercards
    ? calcRealmProgress(usercardsData.user.usercards)
    : { Essentials: 0 };

  const tutorialRealm =
    gql_data && gql_data.realms.filter((r) => r.name === "Essentials");

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      <div className="section">
        <div className="header">Explore Categories</div>
      </div>

      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        {gql_data && realmHash && (
          <div>
            {tutorialRealm.map((realm, i) => (
              <Realm realm={realm} key={i} />
            ))}

            {/* <ProblemsBox /> */}

            {gql_data.realms.map((realm, i) => (
              <Realm
                realm={realm}
                completed={
                  realmHash[realm.name] && realmHash[realm.name].completed
                }
                collected={
                  realmHash[realm.name] && realmHash[realm.name].collected
                }
                key={i}
              />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Learn;
