// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

// *** COMPONENTS ***
import RewardImage from "../components/RewardImage";

// *** ACTIONS ***
import { levelUp } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Today.module.scss";

const Template = () => {
  const [store, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_OBJECTIVES_QUERY);

  return <div>BOiler</div>;
};

export default Template;
