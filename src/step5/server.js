import { createServer } from "node:http";
import escapeHTML from "escape-html";
import { Router } from "./Router.js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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

async function renderJSXToClientJSX(jsx) {
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  )
    return jsx;
  if (Array.isArray(jsx)) {
    const promises = jsx.map((child) => renderJSXToClientJSX(child));
    return await Promise.all(promises);
  }
  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        return {
          ...jsx,
          props: await renderJSXToClientJSX(jsx.props),
        };
      } else if (typeof jsx.type === "function") {
        const Component = jsx.type;
        const renderedComponent = await Component(jsx.props);
        const returnedJSX = await renderJSXToClientJSX(renderedComponent);
        return returnedJSX;
      } else throw new Error("Not Implemented");
    } else {
      const returnObj = {};
      for (let [key, value] of Object.entries(jsx)) {
        const renderedValue = await renderJSXToClientJSX(value);
        returnObj[key] = renderedValue;
      }
      return returnObj;
    }
  } else {
    throw new Error("Not valid");
  }
}

async function sendHTML(response, jsx) {
  let html = await renderJSXToHTML(jsx);
  const jsxString = await generateFullJSX(jsx);
  html += `
  <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@canary",
          "react-dom/client": "https://esm.sh/react-dom@canary/client"
        }
      }
    </script>
    <script type="module" src="./client.js"></script>
    <script id="__INITIAL_CLIENT_JSX_STRING__">${jsxString}</script>
  `;
  response.setHeader("Content-Type", "text/html").end(html);
}

async function serveJS(response, path) {
  const content = await readFile(resolve(`./src/step5${path}`), "utf-8");
  response.setHeader("Content-Type", "text/javascript").end(content);
}

function stringifyJSX(key, value) {
  if (value === Symbol.for("react.element")) {
    return "$RE";
  }
  return value;
}

async function generateFullJSX(jsx) {
  const jsxForClient = await renderJSXToClientJSX(jsx);
  const jsxString = JSON.stringify(jsxForClient, stringifyJSX, 2);
  return jsxString;
}

async function serveJSX(response, jsx) {
  const jsxString = await generateFullJSX(jsx);
  response.setHeader("Content-Type", "application/json").end(jsxString);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.searchParams.has("jsx")) {
    await serveJSX(response, <Router url={url.pathname} />);
  } else if (url.pathname === "/client.js") {
    await serveJS(response, url.pathname);
  } else {
    await sendHTML(response, <Router url={url.pathname} />);
  }
});

server.listen(5005);
console.log("server started at 5005");
