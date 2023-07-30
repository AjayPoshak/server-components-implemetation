import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

export async function Post({ slug }) {
  let content = "";
  try {
    const path = resolve(`./src/step4/content/${slug}.txt`);
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
      <article>{content}</article>
    </div>
  );
}
