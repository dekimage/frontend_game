export const pageview = (url) => {
  if (window !== undefined) {
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
};

export const event = ({ action, params }) => {
  console.log(action, params);
  if (window !== undefined) {
    window.gtag("event", action, params);
    console.log(window.gtag);
  }
};
