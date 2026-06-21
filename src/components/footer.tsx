export function Footer() {
  return (
    <footer className="border-t border-beige/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-10 text-center">
        <p className="font-heading text-lg">Ruzicka Psychology PLLC</p>
        <a
          href="mailto:christina@ruzickapsychology.com"
          className="text-sm text-rose transition hover:text-rose-dark"
        >
          christina@ruzickapsychology.com
        </a>
        <p className="mt-3 text-xs text-ink/60">
          © {new Date().getFullYear()} Ruzicka Psychology PLLC. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
