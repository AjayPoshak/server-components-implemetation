## Challenge 7

When you navigate between two different blog posts, their entire JSX gets diffed. But this doesn't always make sense — conceptually, these are two different posts. For example, if you start typing a comment on one of them, but then press a link, you don't want that comment to be preserved just because the input is in the same location. Can you think of a way to solve this? (Hint: You might want to teach the Router component to treat different pages with different URLs as different components by wrapping the {page} with something. Then you'd need to ensure this "something" doesn't get lost over the wire.)

### Solution

Seems like we need to use keys to make diffing more efficient by telling react that these are two different posts altogether.

```js
function Router({ url, body }) {
  if (url === "/") {
    return (
      <BlogLayoutPage key={url}>
        <section key={url}>
          <HomeIndex />
        </section>
      </BlogLayoutPage>
    );
  }
  if (url === "/favicon.ico") {
    return <p>Not Implemented</p>;
  }
  return (
    <BlogLayoutPage>
      <section key={url}>
        <BlogPostPage postSlug={url} body={body} />
      </section>
    </BlogLayoutPage>
  );
}
```

Problem with above approach is that `section` element is doing nothing except adding `key` prop for diffing. What if we use `Fragment`?
That way we won't have an extra element, and it can also pass the `key`.

In out implementation so far, we don't have support for `key` prop in `fragment`, lets add that.

`rsc.js`

```js
sync function renderJSXToClientJSX(jsx) {
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  )
    return jsx;
  if (Array.isArray(jsx)) {
    const promises = jsx.map((child) => renderJSXToClientJSX(child));
    return await Promise.all(promises);
  }
  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      // ...
      } else if (jsx.type === Symbol.for("react.fragment")) {
        const renderedChildren = await renderJSXToClientJSX(jsx.props.children);
        renderedChildren.key = jsx.key; // Pass key to children so that it can work on client also
        return renderedChildren;
      } else throw new Error("Not Implemented");
    } else {
        // ...
    }
}
```

Now our Router component looks like this

```js
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
```
