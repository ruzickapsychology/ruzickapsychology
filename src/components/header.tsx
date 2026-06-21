import Link from "next/link";
import { site } from "@/content/site";

const navLinks = site.nav;

function NavLink({
  label,
  href,
  external,
}: {
  label: string;
  href: string;
  external?: boolean;
}) {
  const className = "transition hover:text-rose-dark";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="border-b border-greige">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-heading text-xl tracking-wide">
          Ruzicka Psychology
        </Link>

        <nav className="hidden items-center gap-7 text-sm tracking-wide sm:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </nav>

        <details className="group relative sm:hidden">
          <summary className="flex cursor-pointer list-none items-center text-sm tracking-wide [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav className="absolute right-0 z-10 mt-3 flex w-44 flex-col gap-3 rounded-xl border border-greige bg-cream p-5 text-sm tracking-wide shadow-lg">
            {navLinks.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
