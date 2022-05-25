// *** REACT ***
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/store";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useRouter } from "next/router";
import Link from "next/link";
import router from "next/router";

// *** COMPONENTS ***

import clseIcon from "../assets/close.svg";

// *** ACTIONS ***
import { followBuddy } from "../actions/action";

// *** STYLES ***
import cx from "classnames";
import styles from "../styles/Profile.module.scss";

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const router = useRouter();

  return (
    <div className="background_dark">
      <div className="section">Settings</div>
    </div>
  );
};

export default Settings;
