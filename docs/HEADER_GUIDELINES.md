Wytyczne dotyczące nagłówka (header) — Wentitech

Cel
---
Dokument zawiera praktyczne wytyczne projektowe i implementacyjne dla nagłówka strony: struktura, spacing, responsywność, dostępność i konkretne wartości, które należy stosować w kodzie.

Zasady ogólne
---
- Header jest warstwą layoutu: ma stałą wysokość (zmienna CSS) i jest pozycjonowany fixed na górze.
- Używaj skali odstępów (spacing scale) — nie "magic numbers".
- Dziel header logicznie na 3 sekcje: left (logo), center (nav), right (akcje).
- Na mobile ukrywamy centrum (standardowy nav) i pokazujemy hamburger -> dropdown absolute pod headerem.
- Zapewnij min. rozmiar dotykowy dla przycisków: 40x40px.
- Zapewnij focus-visible, aria-* oraz czytelną hierarchię (role/navigation, aria-expanded).
- Unikaj zmiany koloru tekstu przy hover gdy tło zmienia się overlayem — zamiast tego nakładaj półprzezroczysty overlay.

Konkrety (wartości)
---
- Spacing scale (przykład):
  - --space-1: 4px
  - --space-2: 8px
  - --space-4: 16px
  - --space-8: 32px
- Header height:
  - Desktop: 56px
  - Mobile: 48px
  - W kodzie: --header-height: 56px; --header-height-mobile: 48px
- Breakpoints:
  - Desktop: >= 1024px
  - Tablet: >= 768px
  - Phone: < 768px
- Z-index: header 1000, mobile dropdown 1100 (lub 950+ jeśli masz inne elementy)

Responsywność
---
- Na >= 768px: show full nav centered.
- Na < 768px: hide centered nav (.header__flex-center) i pokaż .mobile-menu-toggle.
- Mobile menu: pokaż nav jako absolutny panel pod header (.nav.nav--mobile-open) z orientation column. Nie zmieniaj flow dokumentu.

Dostępność (a11y)
---
- Hamburger: role="button", aria-expanded="true|false", aria-controls="#main-navigation".
- Nav: role="navigation" oraz aria-label (np. "Główna nawigacja").
- Przycisk wywołujący menu musi być focusable i mieć widoczny focus state.
- Po otwarciu mobilnego menu rozważ focus trap (opcjonalnie) lub wyraźny sposób zamknięcia (Esc / przycisk zamknij).

Implementacja w projekcie
---
- Ustal zmienne CSS: --header-height, --header-height-mobile, użyj ich w .header i .header__content.
- Dodaj klasę globalną .has-fixed-header na dokumencie (dodawana przez Header) i zastosuj padding-top do main: .has-fixed-header main { padding-top: var(--header-height); }
- Ukryj na mobile centrum i pokaż nav jako dropdown kiedy `.nav--mobile-open` jest ustawione przez komponent.

Checklist do wdrożenia (krótka)
---
- [ ] Zmienne: --header-height, --header-height-mobile dodane do :root.
- [ ] .header używa height: var(--header-height).
- [ ] .has-fixed-header main { padding-top: var(--header-height); }
- [ ] Nav ma role i id, hamburger ma aria-expanded / aria-controls.
- [ ] Mobile dropdown obsługiwany przez klasę .nav--mobile-open.
- [ ] Test: keyboard navigation, focus states, mobile open/close, long labels.

Dodatkowe zadania (TODO) do implementacji w projekcie
---
- [ ] Dodaj "skip link" (np. <a class="skip-link" href="#main">Pomiń nawigację</a>) widoczny przy focusie, aby ułatwić nawigację klawiaturą.
- [ ] Zamknij mobilne menu na klawisz Escape oraz po kliknięciu poza panel menu (outside click).
- [ ] Przy otwarciu mobilnego menu ustaw focus na pierwszym linku menu i zwróć focus do toggle po zamknięciu.
- [ ] Rozważ pełny focus trap w mobilnym menu (opcjonalnie) jeśli menu jest rozbudowane.
- [ ] Upewnij się, że logo jest semantycznym linkiem (<a href="#home">) i ma aria-label.
- [ ] Dodaj testy manualne: sprawdź działanie Escape, outside click, skip link oraz zachowanie focusa na mobile.
- [ ] Zaktualizuj dokumentację wdrożeniową, aby poinformować deweloperów o potrzebie ustawienia id="main" na głównym elemencie treści.

Notatka implementacyjna:
- Wdrożone zachowania powinny być delikatne (nie przerywać UX) i mieć możliwość wyłączenia przy specjalnych layoutach.


Notatki:
- Jeżeli layout używa innego elementu głównego niż <main>, dostosować selektor `.has-fixed-header main` do używanego kontenera.
- Rozważ dodanie "skip link" na bardzo długich stronach (np. <a class="skip-link" href="#main">Pomiń nawigację</a>).


Autor: automatycznie wygenerowane wytyczne na podstawie rozmowy i dobrych praktyk.
