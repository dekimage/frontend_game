import Link from "next/link";
import { ImageUI } from "@/components/reusableUI";
import styles from "@/styles/Learn.module.scss";

export const Realm = ({
  realm,
  isTutorial = false,
  favoriteRealms,
  setFavoriteRealms,
}) => {
  const toggleRealm = (id) => {
    if (favoriteRealms.includes(id)) {
      setFavoriteRealms(favoriteRealms.filter((realmId) => realmId !== id));
    } else {
      setFavoriteRealms([...favoriteRealms, id]);
    }
  };
  return isTutorial ? (
    <div onClick={() => toggleRealm(realm.id)}>
      <div
        className={styles.realm}
        style={
          favoriteRealms.includes(realm.id)
            ? { border: "2px solid #007bff" }
            : {}
        }
      >
        <div className={styles.realm_body}>
          <div className={styles.realm_name}>{realm.name}</div>
          <div className={styles.realm_description}>{realm.description}</div>
        </div>
        <div className={styles.realm_image}>
          {realm.image && <ImageUI url={realm.image.url} className="image" />}
        </div>
      </div>
    </div>
  ) : (
    // ORIGINAL REALM COMPONENT BELOW
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
