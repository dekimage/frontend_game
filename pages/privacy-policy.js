import { gql, useQuery } from "@apollo/client";

import Loader from "../components/reusable/Loader";
import ReactMarkdown from "react-markdown";
import { normalize } from "../utils/calculations";
import styles from "../styles/Settings.module.scss";
import { useRouter } from "next/router";
import withSEO from "../Hoc/withSEO";

const GET_TERMS = gql`
  query {
    webpage(id: 2) {
      data {
        attributes {
          title
          content
        }
      }
    }
  }
`;

const PrivacyPolicy = () => {
  const { data, loading, error } = useQuery(GET_TERMS);
  const gql_data = data && normalize(data);
  const router = useRouter();

  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  const { title, content } = gql_data.webpage;

  return (
    <div className="background_dark">
      <div className="section">
        <div className={styles.header}>
          <div className={styles.back} onClick={() => router.back()}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>

          <div className={styles.title}>{title}</div>
        </div>
        <ReactMarkdown children={content} />
      </div>
    </div>
  );
};

export default withSEO(PrivacyPolicy);
