import cx from "classnames";
import baseUrl from "@/utils/settings";
const dev = process.env.NODE_ENV == "development";

export const ImageUI = ({
  className = "flex_center",
  url,
  isPublic = false,
  height = "auto",
  width = "auto",
  style = {},
}) => {
  return (
    <div className={className} style={style}>
      <img
        height={height}
        width={width}
        // src={dev || isPublic ? `${baseUrl}${url}` : `${url}`}
        src={isPublic ? `${baseUrl}${url}` : `${url}`}
      />
    </div>
  );
};

export const Button = ({
  type = "primary",
  children,
  className = "",
  autofit = false,
  isLoading = false,
  isDisabled = false,

  onClick,
}) => {
  const handleOnClick = () => {
    if (!onClick || isDisabled || isLoading) {
      return;
    }

    onClick();
  };
  const buttonStyle = autofit ? { width: "100%", maxWidth: "100%" } : {};
  const fullClass = cx(`btn btn-${type}`, className, {
    "btn-disabled": isDisabled,
    isLoading,
  });

  return (
    <div
      tabIndex="0"
      className={fullClass}
      style={buttonStyle}
      onClick={handleOnClick}
    >
      {isLoading ? (
        <div className="lds-dual-ring"></div>
      ) : (
        <div className="btn--content">{children}</div>
      )}
    </div>
  );
};
