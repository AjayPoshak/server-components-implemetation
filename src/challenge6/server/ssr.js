import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";

async function serveJS(response, path) {
  const content = await readFile(resolve(`./src/challenge6${path}`), "utf-8");
  response.setHeader("Content-Type", "text/javascript").end(content);
}

function parseJSX(key, value) {
  if (value === "$RE") {
    return Symbol.for("react.element");
  }
  return value;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === "/client.js") {
    await serveJS(response, url.pathname);
  } else {
    const clientJSXResponse = await fetch(
      "http://localhost:5001" + url.pathname
    );
    if (!clientJSXResponse.ok) {
      response.statusCode = clientJSXResponse.status;
      response.end();
      return;
    }
    const clientJSX = await clientJSXResponse.text();
    if (url.searchParams.has("jsx")) {
      return response
        .setHeader("Content-Type", "application/json")
        .end(clientJSX);
    } else {
      const jsx = JSON.parse(clientJSX, parseJSX);
      let html = await renderToString(jsx);
      console.log(html);
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
      <script>window.__INITIAL_CLIENT_JSX_STRING__=${JSON.stringify(
        clientJSX
      ).replace(/>/g, "\\u003c")}</script>
    `;
      response.setHeader("Content-Type", "text/html").end(html);
    }
  }
});

server.listen(5005);
console.log("server started at 5005");
