const revealItems = document.querySelectorAll(".reveal");
const navLinks = [...document.querySelectorAll(".nav-links a")];

const setActiveNav = targetHref => {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === targetHref);
  });
};

const initActiveNavigation = () => {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const pageTargetMap = {
    "about.html": "index.html#about",
    "coaching.html": "index.html#coaching",
    "programs.html": "index.html#programs",
    "faq.html": "index.html#faq",
    "contact.html": "contact.html"
  };

  if (pageTargetMap[page]) {
    setActiveNav(pageTargetMap[page]);
    return;
  }

  const sectionLinks = navLinks.filter(link => link.getAttribute("href").startsWith("#"));
  const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActiveSection = () => {
    let activeId = "home";
    const headerOffset = 120;

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= headerOffset) {
        activeId = section.id;
      }
    });

    setActiveNav(`#${activeId}`);
  };

  sectionLinks.forEach(link => {
    link.addEventListener("click", () => {
      setActiveNav(link.getAttribute("href"));
    });
  });

  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("hashchange", updateActiveSection);
};

initActiveNavigation();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

document.querySelectorAll("[data-accordion]").forEach(accordion => {
  const items = accordion.querySelectorAll(".accordion-item");

  const setPanelHeight = item => {
    const panel = item.querySelector(".accordion-panel");
    panel.style.maxHeight = item.classList.contains("active") ? `${panel.scrollHeight}px` : "0px";
  };

  items.forEach(item => {
    setPanelHeight(item);
    const button = item.querySelector(".accordion-trigger");

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      items.forEach(other => {
        other.classList.remove("active");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        setPanelHeight(other);
      });

      if (!isOpen) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        setPanelHeight(item);
      }
    });
  });
});

document.querySelectorAll("[data-progress-form]").forEach(form => {
  const fields = [...form.querySelectorAll("[data-progress-field]")];
  const bar = form.querySelector("[data-progress-bar]");
  const text = form.querySelector("[data-progress-text]");

  const updateProgress = () => {
    const filled = fields.filter(field => String(field.value).trim().length > 0).length;
    const percent = Math.round((filled / fields.length) * 100);
    bar.style.width = `${percent}%`;
    text.textContent = `${percent}%`;
  };

  fields.forEach(field => field.addEventListener("input", updateProgress));
  fields.forEach(field => field.addEventListener("change", updateProgress));
  updateProgress();
});
