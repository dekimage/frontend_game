import { Action } from "../../components/cardPageComps";
import { Course } from "../../components/shopComps";
import ExpandableComponent from "../../components/ExpandableComponent";
import { GET_BOOK_ID } from "../../GQL/query";
import NavBar from "../../components/NavBar";
import ReactMarkdown from "react-markdown";
import { normalize } from "../../utils/calculations";
import styles from "../../styles/Book.module.scss";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import baseUrl from "../../utils/settings";
// import styles from "../../styles/Problem.module.scss";

const BookView = ({ book }) => {
  const {
    id,
    name,
    author,
    image,
    ideas,
    cards,
    actions,
    course,
    problems,
    realm,
  } = book;

  const router = useRouter();

  console.log(ideas);

  return (
    <div>
      <div onClick={() => router.back()}>
        <ion-icon name="chevron-back-outline"></ion-icon>
      </div>
      <div className={styles.book_image}>
        {image && <img src={`${baseUrl}${image.url}`} height="160px" />}
      </div>

      <div className={styles.book_name}>{name}</div>
      <div className={styles.book_author}>By {author}</div>

      <ExpandableComponent
        name={"5 Key Ideas"}
        children={
          <div>
            <ReactMarkdown children={ideas} />
          </div>
        }
      />
      <ExpandableComponent
        name={"5 Actions"}
        tag={"free"}
        children={
          <div>
            {actions.map((a, i) => (
              <Action action={a} key={i} parent="problem" />
            ))}
          </div>
        }
      />

      <ExpandableComponent
        name={"Program inspired by this book"}
        children={<Course course={course} />}
      />
    </div>
  );
};

const BookPage = () => {
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_BOOK_ID, {
    variables: { id: router.query.id },
  });

  const gql_data = data && normalize(data);

  return (
    <div className="background_dark">
      <div className="section">
        {error && <div>Error: {error}</div>}
        {loading && <div>Load</div>}
        {gql_data && (
          <div>
            <BookView book={gql_data.book} />
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default BookPage;
