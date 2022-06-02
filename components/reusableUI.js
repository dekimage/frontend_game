const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// src={`${baseUrl}/gift.png`}
export const ImageUI = ({ className = "", imgUrl, height }) => {
  return (
    <div className={className}>
      <img height={height} src={`${baseUrl}${imgUrl}`} />
    </div>
  );
};
