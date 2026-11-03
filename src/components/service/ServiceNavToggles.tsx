"use client";

import type { MouseEvent } from "react";

export function FullMenuToggle() {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.currentTarget.parentElement?.querySelector(".full-menu")?.classList.toggle("open");
  }
  return (
    <button className="hamburger-btn" type="button" onClick={onClick} aria-label="Menu">
      <span className="hamburger-icon">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}

/** En el menu completo, "Servicios" despliega el submenu en vez de navegar. */
export function ServicesMenuToggle({ href, label }: { href: string; label: string }) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    e.currentTarget.nextElementSibling?.classList.toggle("open");
  }
  return (
    <a href={href} onClick={onClick}>
      {label}
    </a>
  );
}
