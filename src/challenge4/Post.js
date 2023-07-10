import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import Markdown from "react-markdown";
import { Image } from "./Image.js";

export async function Post({ slug }) {
  let content = "";
  try {
    const path = resolve(`./src/challenge4/content/${slug}.txt`);
    await access(path);
    content = await readFile(path, "utf-8");
  } catch (err) {
    console.log(err);
  }
  return (
    <div>
      <h2>
        <a href={`/${slug}`}>{slug}</a>
      </h2>
      <Markdown components={{ img: Image }}>{content}</Markdown>
    </div>
  );
}
