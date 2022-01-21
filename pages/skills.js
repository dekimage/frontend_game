import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";

const QUERY = gql`
  {
    spells {
      id
      name
    }
  }
`;

const Skills = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(QUERY);
  const [store, dispatch] = useContext(Context);
  const [spells, setSpells] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      dispatch({ type: "UPDATE_XP", data });
    }
  }, [loading, spells]);

  if (error) return "Error loading skills";
  if (loading) return <h1>Fetching...</h1>;

  return (
    <div>
      {store.user.username}
      {store.spells && store.spells.length && (
        <div>
          {store.spells.map((s) => (
            <div>{s.id}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
