import { GET_REALMS } from "../GQL/query";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { Realm } from "../components/Realm";
import { normalize } from "../utils/calculations";
import { useQuery } from "@apollo/react-hooks";

const Learn = () => {
  const { data, loading, error } = useQuery(GET_REALMS);
  const gql_data = data && normalize(data);

  const tutorialRealm =
    gql_data && gql_data.realms.filter((r) => r.name === "Essentials");

  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      <div className="section">
        <div className="header">Explore Categories</div>
      </div>

      <div className="subHeader">Optimize your life across multiple areas</div>

      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div className="lds-dual-ring"></div>}
        {gql_data && (
          <div>
            {tutorialRealm.map((realm, i) => (
              <Realm realm={realm} key={i} />
            ))}

            {gql_data.realms.map((realm, i) => (
              <Realm realm={realm} key={i} />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Learn;
