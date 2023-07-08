## Challenge 2

Implement support for fragments (<>) in the RSC renderer. This should only take a couple of lines of code, but you need to figure out where to place them and what they should do.

### Solution

Fragments are used to wrap a collection of elements which are same level without adding a node to the DOM. It means that their function is purely limited to React's VDOM only.

First of all, we need to check how they're represented in JSX. Let's wrap a component in Fragment and inspect the generated JSX.
In `rsc.js`, if we just wrap `<></>` around `Router` component and inspect the output in `renderJSXToClientJSX` function, we see this.

```
{
  '$$typeof': Symbol(react.element),
  type: Symbol(react.fragment),
  key: null,
  ref: null,
  props: {
    children: {
      '$$typeof': Symbol(react.element),
      type: [Function: Router],
      key: null,
      ref: null,
      props: [Object],
      _owner: null,
      _store: {}
    }
  },
  _owner: null,
  _store: {}
}
```

It is evident from above output, that we can use `type` field to detect if this is a fragment. Once detected we can just return its children.

`rsc.js`

```js
sync function renderJSXToClientJSX(jsx) {
  // ...
  if (Array.isArray(jsx)) {
    // handle array
  }
  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        // handle string
      } else if (typeof jsx.type === "function") {
        // handle function components
      } else if (jsx.type === Symbol.for("react.fragment")) {
        // Render the `children` prop and return the result because Fragment does not have any other props.
        const renderedChildren = await renderJSXToClientJSX(jsx.props.children);
        return renderedChildren;
      } else throw new Error("Not Implemented");
    }
  }
}
```

`HomeIndex.js`

```js
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
```
