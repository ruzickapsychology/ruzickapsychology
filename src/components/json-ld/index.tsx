import { serializeJsonLd } from "@/config/seo";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      data-slot="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
