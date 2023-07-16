import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function Comments({ body, slug }) {
  const filePath = resolve(`./src/challenge5/server/${slug}-comments.txt`);
  try {
    if (body.comment) {
      await writeFile(filePath, "\n" + body.comment, { flag: "a+" });
    }
  } catch (err) {
    console.error(err);
  }
  let comments = [];
  try {
    // Read from file to render the comments
    const content = await readFile(filePath, "utf-8");
    comments = content.split("\n").filter((token) => token !== "\n");
  } catch (err) {
    console.error(err);
  }

  return (
    <section>
      <form method="post">
        <input name="comment" type="text" />
        <button>Add Comment</button>
      </form>
      {comments.map((comment, index) => (
        <div key={index}>{comment}</div>
      ))}
    </section>
  );
}
