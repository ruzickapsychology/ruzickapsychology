import Link from "next/link";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Specialties", href: "/#services" },
  { label: "Client Portal", href: "https://ruzickapsychology.clientsecure.me", external: true },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="border-b border-beige/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-heading text-xl tracking-wide">
          Ruzicka Psychology
        </Link>
        <nav className="flex items-center gap-7 text-sm tracking-wide">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-rose"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-rose"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
