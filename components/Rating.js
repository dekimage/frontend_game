import baseUrl from "../utils/settings";
export const Rating = ({ course }) => {
  return (
    <div>
      {Array.from(Array(Math.floor(course.rating)).keys()).map((s) => (
        <img
          src={`${baseUrl}/star.png`}
          key={s}
          height="15px"
          className="mr25"
        />
      ))}
      {Array.from(Array(Math.ceil(5 - course.rating)).keys()).map((s) => (
        <img
          src={`${baseUrl}/rating.png`}
          key={s}
          height="15px"
          className="mr25"
        />
      ))}
    </div>
  );
};
