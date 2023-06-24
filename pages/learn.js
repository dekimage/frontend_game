import { GET_REALMS } from "@/GQL/query";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { Realm } from "@/components/Realm";
import { withUser } from "@/Hoc/withUser";

const Learn = ({ data }) => {
  return (
    <div className="background_dark">
      <Header />
      <div className="headerSpace"></div>

      <div className="section">
        <div className="header">Explore Categories</div>
      </div>

      <div className="subHeader">Optimize your life across multiple areas</div>

      <div className="section">
        <div>
          {data.realms.map((realm, i) => (
            <Realm realm={realm} key={i} />
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default withUser(Learn, GET_REALMS);
