import "./styles.css";
import { initSidebar } from "./sidebar.js";
import { setContentHeading } from "./content.js";

initSidebar({
  onLinkClicked: (event) => setContentHeading(event)
});
