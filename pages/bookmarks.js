import { ImageUI } from "@/components/reusableUI";
import { useContext, useEffect, useState } from "react";
import { BackButton } from "@/components/reusable/BackButton";
import { GET_BOOKMARKS } from "@/GQL/query";
import NavBar from "@/components/NavBar";
import { NotFoundContainer } from "@/components/Today/NotFoundContainer";
import _ from "lodash";
import styles from "@/styles/Realm.module.scss";
import { useLazyQuery } from "@apollo/react-hooks";
import { Context } from "@/context/store";
import { normalize } from "@/utils/calculations";
import {
  ContentRow,
  TableHeader,
} from "@/components/CardContent/CardContentTab";
import { CONTENT_MAP, SAVED_TYPES } from "@/data/contentTypesData";
import Loader from "@/components/reusable/Loader";

const Bookmarks = () => {
  const [contents, setContents] = useState([]);
  const [store, dispatch] = useContext(Context);

  const [getBookmarks, { data, loading, error }] = useLazyQuery(GET_BOOKMARKS, {
    variables: {
      userId: store.user?.id,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (store.user?.id) {
      getBookmarks({
        userId: store.user.id,
      });
    }
  }, [store.gqlRefetch, store.user.id]);

  useEffect(() => {
    if (data) {
      const gql_data = normalize(data);
      setContents(transformData(gql_data.usersPermissionsUser));
    }
  }, [data]);

  // Perform the transformation
  function transformData(data) {
    const transformedData = [];

    // Loop through each key in the data object
    for (const key in data) {
      if (Array.isArray(data[key])) {
        // Check if the key is an array
        const contentType = SAVED_TYPES[key]; // Get the corresponding type
        if (contentType) {
          // If the contentType is defined in SAVED_TYPES
          const contentArray = data[key]; // Get the array from the key
          contentArray.forEach((item) => {
            // Map over each item in the array and add the 'type' property
            transformedData.push({
              ...item,
              type: contentType,
              isFromBookmark: true,
            });
          });
        }
      }
    }

    return transformedData;
  }

  if (!error && !loading && contents.length) {
    return (
      <div className="background_dark">
        <div>
          <div className="section">
            <div className={styles.header}>
              <BackButton routeDynamic={""} routeStatic={"/"} />

              <div className={`${styles.realmLogo} ml1 mr1`}>Bookmarks</div>
              <div className="flex_center">
                <ImageUI url={"/bookmark.png"} height="22px" isPublic />
              </div>
            </div>
          </div>

          <div>
            <TableHeader isFromBookmark />
            {contents.length > 0 &&
              contents.map((content, i) => (
                <ContentRow content={content} key={i} />
              ))}
          </div>
        </div>

        <NavBar />
      </div>
    );
  } else {
    if (contents.length < 1) {
      <NotFoundContainer
        text={"You don't have any activated Cards for today."}
      />;
    }
  }
  return <Loader />;
};

export default Bookmarks;
