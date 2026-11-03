import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

export function LegalPage(props: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
  note: string;
}) {
  return (
    <main className="legal-page wrap">
      <a className="back-link" href={props.backHref}>
        ‹ {props.backLabel}
      </a>
      <span className="eyebrow">{props.eyebrow}</span>
      <h1>{props.title}</h1>
      <p className="legal-updated">{props.updated}</p>
      {props.sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      <p className="legal-note">{props.note}</p>
    </main>
  );
}
