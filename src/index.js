import "./styles.css";
import { initSidebar } from "./sidebar.js";
import { setContentHeading } from "./content.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  setContentHeading(window.location.hash.slice(1));
});

window.addEventListener("hashchange", () => {
  setContentHeading(window.location.hash.slice(1));
});