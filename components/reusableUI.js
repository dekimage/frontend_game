const BASE_URL = "http://localhost:1337";
export const ImageUI = ({ className = "", imgUrl, height }) => {
  return (
    <div className={className}>
      <img height={height} src={`${BASE_URL}${imgUrl}`} />
    </div>
  );
};
