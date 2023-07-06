import { createServer } from "node:http";
import { readFile, readdir, access } from "node:fs/promises";
import escapeHTML from "escape-html";
import { resolve } from "node:path";
import { BlogPostPage } from "./BlogPostPage.js";
import { BlogLayoutPage } from "./BlogLayoutPage.js";
import { HomeIndex } from "./HomeIndex.js";

function renderJSXToHTML(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number")
    return escapeHTML(jsx);
  if (typeof jsx === "boolean" || jsx == null) return "";
  if (Array.isArray(jsx)) {
    return jsx.map((child) => renderJSXToHTML(child)).join("");
  }
  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "function") {
        if (jsx.$$typeof === Symbol.for("react.element")) {
          return renderJSXToHTML(jsx.type({ ...jsx.props }));
        }
      }
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
      html += renderJSXToHTML(jsx.props.children);
      html += "</" + jsx.type + ">";
      return html;
    } else {
      throw new Error("invalid object");
    }
  }
  console.log(
    typeof jsx === "object",
    jsx.$$typeof === Symbol.for("react.element"),
    jsx
  );
  throw new Error("Not Implemented");
}

function sendHTML(response, jsx) {
  const html = renderJSXToHTML(jsx);
  response.setHeader("Content-Type", "text/html").end(html);
}

const server = createServer(async (request, response) => {
  const author = "Jane Doe";

  switch (request.url) {
    case "/": {
      const filesList = await readdir(resolve("./src/step3/content"));
      const fileNames = filesList.map((fileName) => fileName.split(".")[0]);
      const contentPromises = filesList.map((file) =>
        readFile(resolve(`./src/step3/content/${file}`), "utf-8")
      );
      const contents = await Promise.all(contentPromises);
      sendHTML(
        response,
        <BlogLayoutPage author={author}>
          <HomeIndex slugs={fileNames} contents={contents} />
        </BlogLayoutPage>
      );
      break;
    }

    default:
      try {
        const filePath = resolve(`./src/step3/content/${request.url}.txt`);
        await access(filePath);
        console.log("can access");
        const postContent = await readFile(filePath, "utf-8");
        sendHTML(
          response,
          <BlogLayoutPage author={author}>
            <BlogPostPage postSlug={request.url} postContent={postContent} />
          </BlogLayoutPage>
        );
      } catch {
        console.error(request.url + " cannot be accessed");
        sendHTML(response, <p>Cannot be accessed</p>);
      }
  }
});

server.listen(5005);
console.log("server started at 5005");
