import SEO from "@/components/SEO";
import { SEO_CONFIG } from "@/data/configSEO";
import { useRouter } from "next/router";

function hyphenToCamel(str) {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

function withSEO(Component) {
  return function SEOHOC(props) {
    const router = useRouter();
    const routerPage = router.pathname.split("/")[1];
    const page = hyphenToCamel(routerPage);

    const { title, description, keywords } = SEO_CONFIG[page];

    return (
      <>
        <SEO title={title} description={description} keywords={keywords} />
        <Component {...props} />
      </>
    );
  };
}

export default withSEO;
