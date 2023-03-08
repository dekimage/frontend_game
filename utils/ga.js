const GA_CODE = "G-5JYJD7KRSF";

export const pageview = (url) => {
  if (window !== undefined) {
    window.gtag("config", GA_CODE, {
      page_path: url,
    });
  }
};

export const event = ({ action, params }) => {
  if (window !== undefined) {
    window.gtag("event", action, params);
  }
};
