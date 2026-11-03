"use client";

import type { MouseEvent } from "react";

/** Abre y cierra el menu completo (hamburguesa). */
export function MenuToggle() {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    const menu = e.currentTarget.parentElement?.querySelector(".full-menu");
    if (!menu) return;
    const open = menu.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
  }
  return (
    <button className="hamburger-btn" type="button" onClick={onClick} aria-label="Menu" aria-expanded="false">
      <span className="hamburger-icon">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}

/** Abre el menu de idiomas. */
export function DropdownToggle({ label }: { label: string }) {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.currentTarget.nextElementSibling?.classList.toggle("open");
  }
  return (
    <button className="lang-current" type="button" onClick={onClick} aria-label="Change language">
      {label} <span className="lang-arrow">⌄</span>
    </button>
  );
}
