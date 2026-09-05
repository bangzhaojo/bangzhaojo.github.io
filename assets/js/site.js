const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "dark" || storedTheme === "light") {
  root.dataset.theme = storedTheme;
}

toggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});

const views = [...document.querySelectorAll("[data-view]")];
const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const validViews = new Set(views.map((view) => view.dataset.view));

function showView(viewName, { moveFocus = false } = {}) {
  const nextView = validViews.has(viewName) ? viewName : "research";

  views.forEach((view) => {
    const isActive = view.dataset.view === nextView;
    view.hidden = !isActive;
    view.setAttribute("aria-hidden", String(!isActive));
  });

  navigationLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${nextView}`;
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (moveFocus) {
    document.querySelector(`[data-view="${nextView}"] h1, [data-view="${nextView}"] h2`)?.focus({ preventScroll: true });
  }
}

function viewFromHash() {
  return window.location.hash.slice(1) || "research";
}

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const viewName = link.getAttribute("href").slice(1);
    history.pushState(null, "", `#${viewName}`);
    showView(viewName);
  });
});

window.addEventListener("hashchange", () => showView(viewFromHash()));
window.addEventListener("popstate", () => showView(viewFromHash()));
showView(viewFromHash());
