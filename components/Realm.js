import Link from "next/link";
import { ImageUI } from "../components/reusableUI";
import styles from "../styles/Learn.module.scss";

export const Realm = ({ realm }) => {
  return (
    <Link
      href={{ pathname: "/realm/[id]", query: { id: realm.id } }}
      as={`/realm/${realm.id}`}
      key={realm.id}
    >
      <div className={styles.realm}>
        <div className={styles.realm_body}>
          <div className={styles.realm_name}>{realm.name}</div>
          <div className={styles.realm_description}>{realm.description}</div>
        </div>
        <div className={styles.realm_image}>
          {realm.image && <ImageUI url={realm.image.url} className="image" />}
        </div>
      </div>
    </Link>
  );
};
