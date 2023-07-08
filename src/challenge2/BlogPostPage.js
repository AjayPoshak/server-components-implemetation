import { Post } from "./Post.js";

export function BlogPostPage({ postSlug }) {
  return (
    <section>
      <Post slug={postSlug} />
    </section>
  );
}
