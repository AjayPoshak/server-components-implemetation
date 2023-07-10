import { BlogPostPage } from "./BlogPostPage.js";
import { BlogLayoutPage } from "./BlogLayoutPage.js";
import { HomeIndex } from "./HomeIndex.js";

export function Router({ url }) {
  if (url === "/") {
    return (
      <BlogLayoutPage>
        <HomeIndex />
      </BlogLayoutPage>
    );
  }
  if (url === "/favicon.ico") {
    return <p>Not Implemented</p>;
  }
  return (
    <BlogLayoutPage>
      <BlogPostPage postSlug={url} />
    </BlogLayoutPage>
  );
}
