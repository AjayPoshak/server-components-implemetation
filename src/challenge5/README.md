## Challenge 5

Add a comment section to each blog post. Keep comments stored in a JSON file on the disk. You will need to use <form> to submit the comments. As an extra challenge, extend the logic in client.js to intercept form submissions and prevent reloading the page. Instead, after the form submits, refetch the page JSX so that the comment list updates in-place.

### Solution

Lets build a `Comments` component that uses `form` for comments.

```js
async function Comments({ body, slug }) {
  const filePath = resolve(`./<file-path>/${slug}-comments.txt`);
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
    // Parse comments from file text
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
```

If we take a look at our current architecture, then this `Comments` component is rendering in `rsc.js` while our POST submissing is happening in `ssr.js`. So we need to read the POST request body in `ssr.js`, and also make a POST request to `rsc.js` so that it can read the new comment from request body.

`ssr.js`

```js
let clientJSXResponse = null;
if (request.method === "POST") {
  // `rawData` is in form `name=whatever-data`, so we extract the data and save it in a file
  const rawData = await rawReqToString(request);
  // Parse data to JSON
  const body = parseKeyValue(rawData);
  // Make the POST call to rsc process with comments data
  clientJSXResponse = await fetch("http://localhost:5001" + url.pathname, {
    method: "POST",
    body: JSON.stringify(body),
  });
} else {
  // Usual GET call
  clientJSXResponse = await fetch("http://localhost:5001" + url.pathname);
}
```

`rsc.js`

```js
let body = null;
if (request.method === "POST") {
  // Parse request body if method is POST
  body = JSON.parse(await rawReqToString(request));
}
// Pass the parsed body to Router component so that it can forward it to Comments component as props
const jsxString = await serveJSX(<Router url={url.pathname} body={body} />);
```
