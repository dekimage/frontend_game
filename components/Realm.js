import Link from "next/link";
import { ProgressBox } from "../components/Card";
import iconCollection from "../assets/progress-play-dark.svg";
import iconPlay from "../assets/progress-collection-dark.svg";
import styles from "../styles/Learn.module.scss";

export const Realm = ({ realm, completed, collected }) => {
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
          <ProgressBox
            icon={iconPlay}
            progress={completed || 0}
            maxProgress={100}
            isPercent
          />
        </div>
        <div className={styles.realm_image}>
          {realm.image && <img className="image" src={realm.image.url} />}
        </div>
      </div>
    </Link>
  );
};
