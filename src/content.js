const contentHeading = document.getElementById("main-content-heading");

// Extract the page name from the sidebar click event, set the main content heading
export const setContentHeading = (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const pageName = link.dataset.page;
  if (!pageName) return;

  contentHeading.textContent = pageName;
};
