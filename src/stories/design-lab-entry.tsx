import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "../styles.css";
import { createRoot } from "react-dom/client";
import { DesignLab } from "./design-lab";

const root = document.getElementById("root");
if (root) createRoot(root).render(<DesignLab />);
