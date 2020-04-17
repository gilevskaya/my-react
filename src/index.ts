import { createElement } from "./element.js";
import { render } from "./fiber.js";
////////////

const ReReact = {
  createElement,
  render,
};

const element = ReReact.createElement(
  "div",
  { id: "test-id" },
  ReReact.createElement("h1", null, "Hello"),
  ReReact.createElement("div", null, "div-content")
);
// /** @jsx ReReact.createElement */
// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// );

console.log("element", element);

const container = document.getElementById("root");
ReReact.render(element, container);
