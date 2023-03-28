import Head from "next/head";

export default function SEO({
  title,
  description,
  keywords,
  image,
  author,
  robots,
  canonical,
  viewport,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {image && <meta property="og:image" content={image} />}
      {author && <meta name="author" content={author} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {viewport && <meta name="viewport" content={viewport} />}
    </Head>
  );
}
