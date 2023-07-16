import { Comments } from "./Comments.js";
import { Post } from "./Post.js";

export function BlogPostPage({ postSlug, body }) {
  return (
    <section>
      <Post slug={postSlug} />
      <Comments body={body} slug={postSlug} />
    </section>
  );
}
