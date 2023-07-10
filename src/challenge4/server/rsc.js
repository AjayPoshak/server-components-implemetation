import { createServer } from "node:http";
import { Router } from "../Router.js";

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
      } else if (jsx.type === Symbol.for("react.fragment")) {
        const renderedChildren = await renderJSXToClientJSX(jsx.props.children);
        return renderedChildren;
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

function stringifyJSX(key, value) {
  if (value === Symbol.for("react.element")) {
    return "$RE";
  }
  return value;
}

async function generateClientJSX(jsx) {
  const jsxForClient = await renderJSXToClientJSX(jsx);
  const jsxString = JSON.stringify(jsxForClient, stringifyJSX, 2);
  return jsxString;
}

async function serveJSX(jsx) {
  const jsxString = await generateClientJSX(jsx);
  return jsxString;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const jsxString = await serveJSX(<Router url={url.pathname} />);
    response.setHeader("Content-Type", "application/json").end(jsxString);
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.end();
  }
});

server.listen(5001);
console.log("RSC server started at 5001");
