import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/config/seo";

type BreadcrumbTrailItem = BreadcrumbItem & {
  href?: string;
};

export function BreadcrumbTrail({
  items,
  currentPath,
}: {
  items: readonly BreadcrumbTrailItem[];
  currentPath: string;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          items.map((item) => ({
            name: item.label,
            path: item.href ?? currentPath,
          })),
        )}
      />
      <Breadcrumbs items={items} />
    </>
  );
}
