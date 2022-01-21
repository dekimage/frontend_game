import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/store";
import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";
import Item from "../components/Item";
import styles from "../styles/Home.module.scss";

const User = () => {
  const [store, dispatch] = useContext(Context);

  return (
    <div>
      <div>
        EQUIPPED ITEMS:
        {store.user.equipped_items &&
          store.user.equipped_items.map((item) => {
            return <Item item={item} isEquipped={true} />;
          })}
      </div>
      <div>
        INVENTORY ITEMS:
        {store.user.inventory &&
          store.user.inventory.map((item) => {
            return <Item item={item} isEquipped={false} />;
          })}
      </div>
    </div>
  );
};

export default User;
