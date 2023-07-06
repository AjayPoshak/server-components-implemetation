import { createServer } from "node:http";
import escapeHTML from "escape-html";
import { Router } from "./Router.js";

async function renderJSXToHTML(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number")
    return escapeHTML(jsx);
  if (typeof jsx === "boolean" || jsx == null) return "";
  if (Array.isArray(jsx)) {
    const children = jsx.map((child) => renderJSXToHTML(child));
    const childrenReponse = await Promise.all(children);
    return childrenReponse.join("");
  }
  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "function") {
        const Component = await jsx.type({ ...jsx.props });
        const response = await renderJSXToHTML(Component);
        return response;
      } else if (typeof jsx.type === "string") {
        let html = "<";
        html += jsx.type;
        for (let [key, value] of Object.entries(jsx.props)) {
          if (key !== "children") {
            html += " " + key;
            html += " = ";
            html += escapeHTML(value);
          }
        }
        html += ">";
        html += await renderJSXToHTML(jsx.props.children);
        html += "</" + jsx.type + ">";
        return html;
      } else throw new Error("Invalid object");
    } else {
      throw new Error("Cannot render an object");
    }
  }
  throw new Error("Not Implemented");
}

async function sendHTML(response, jsx) {
  const html = await renderJSXToHTML(jsx);
  response.setHeader("Content-Type", "text/html").end(html);
}

const server = createServer(async (request, response) => {
  await sendHTML(response, <Router url={request.url} />);
});

server.listen(5005);
console.log("server started at 5005");
