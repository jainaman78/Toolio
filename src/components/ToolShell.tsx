
import Link from "next/link";
import type { ReactNode } from "react";

type ToolShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ToolShell({
  title,
  description,
  children,
}: ToolShellProps) {
  return (
    <main className="container tool-page">
      <nav
        className="breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{title}</span>
      </nav>

      <header className="tool-heading">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <section
        className="tool-panel"
        aria-label={`${title} tool`}
      >
        {children}
      </section>
    </main>
  );
}
