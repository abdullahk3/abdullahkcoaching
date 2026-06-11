const revealItems = document.querySelectorAll(".reveal");

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
    const filled = fields.filter(field => field.value.trim().length > 0).length;
    const percent = Math.round((filled / fields.length) * 100);
    bar.style.width = `${percent}%`;
    text.textContent = `${percent}%`;
  };

  fields.forEach(field => field.addEventListener("input", updateProgress));
  fields.forEach(field => field.addEventListener("change", updateProgress));
  updateProgress();
});
