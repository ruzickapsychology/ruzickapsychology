import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-greige">
      <Container className="flex flex-col gap-1 py-10 text-center">
        <p className="font-heading text-lg">{site.legalName}</p>
        <a
          href={`mailto:${site.email}`}
          className="text-sm text-rose-dark transition hover:text-ink"
        >
          {site.email}
        </a>
        <p className="mt-3 text-xs text-ink/60">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
