import React from "react";
import { BlogPostPage } from "./BlogPostPage.js";
import { BlogLayoutPage } from "./BlogLayoutPage.js";
import { HomeIndex } from "./HomeIndex.js";

export function Router({ url, body }) {
  if (url === "/") {
    return (
      <React.Fragment key={url}>
        <BlogLayoutPage>
          <HomeIndex />
        </BlogLayoutPage>
      </React.Fragment>
    );
  }
  if (url === "/favicon.ico") {
    return <p>Not Implemented</p>;
  }
  return (
    <React.Fragment key={url}>
      <BlogLayoutPage>
        <BlogPostPage postSlug={url} body={body} />
      </BlogLayoutPage>
    </React.Fragment>
  );
}
