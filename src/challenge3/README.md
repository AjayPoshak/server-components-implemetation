## Challenge 3

Once you do that, change the blog to format the blog posts as Markdown using the <Markdown> component from react-markdown. Yes, our existing code should be able to handle that!

### Solution

Lets install `react-markdown` first and then use `<Markdown />` and add some markdown. Because our components are rendered on server, it will render the markdown on server and give the output as HTML. No need for client to download `react-markdown` package.

`Post.js`

```js
import Markdown from "react-markdown";

export async function Post({ slug }) {
  // Reading post specific data
  return (
    <div>
      <h2>
        <a href={`/${slug}`}>{slug}</a>
      </h2>
      <article>
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
```

Then let's add some markdown in our txt files.

`bye.txt`

```md
## Bye

Bye Bye!!
```
