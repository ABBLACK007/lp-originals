// Renders schema.org structured data. "<" is escaped so no value can close the script tag (XSS-safe
// even if product text later comes from a CMS).
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
