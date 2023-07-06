import escapeHTML from "escape-html";

export function BlogPostPage({ postSlug, postContent }) {
  return (
    <section>
      <h2>
        <a href={"/" + postSlug}>{postSlug}</a>
      </h2>
      <article>{escapeHTML(postContent)}</article>
    </section>
  );
}
