import { Post } from "./Post.js";
import { resolve } from "node:path";
import { readdir } from "node:fs/promises";

export async function HomeIndex() {
  const filesList = await readdir(resolve("./src/step4/content"));
  const fileNames = filesList.map((fileName) => fileName.split(".")[0]);
  return (
    <section>
      <ul>
        {fileNames.map((slug) => (
          <li>
            <Post slug={slug} />
          </li>
        ))}
      </ul>
    </section>
  );
}
