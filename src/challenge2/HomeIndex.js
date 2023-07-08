import { Post } from "./Post.js";
import { resolve } from "node:path";
import { readdir } from "node:fs/promises";

function Posts({ fileNames }) {
  return (
    <>
      {fileNames.map((slug) => (
        <li>
          <Post slug={slug} />
        </li>
      ))}
    </>
  );
}

export async function HomeIndex() {
  const filesList = await readdir(resolve("./src/step4/content"));
  const fileNames = filesList.map((fileName) => fileName.split(".")[0]);
  return (
    <section>
      <ul>
        <Posts fileNames={fileNames} />
      </ul>
    </section>
  );
}
