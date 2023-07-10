## Challenge 4

The `react-markdown` component supports specifying custom implementations for different tags. For example, you can make your own Image component and pass it as `<Markdown components={{ img: Image }}>`. Write an Image component that measures the image dimensions (you can use some npm package for that) and automatically emits width and height.

### Solution

Let's create a Image component which measures the height and width of given image url. One thing to keep in mind is that we need to measure this on server, not on browser. Now we can't render an image on server, so how can we measure its height and width??

There is a package called [image-size](https://github.com/image-size/image-size) which detects the image dimensions in nodejs environment. It has different calculation functions based on image type(png, gif, jpeg etc). For example, this is how it calculates the [dimension for png image](https://github.com/image-size/image-size/blob/main/lib/types/png.ts#L25-L37).

```js
import imageSize from "image-size";

export async function Image({ src }) {
  const { width, height } = imageSize(src);
  let imageContent = "";
  try {
    const data = await readFile(src, "");
    // convert image file to base64-encoded string
    const base64Image = Buffer.from(data, "binary").toString("base64");
    // combine all strings
    imageContent = `data:image/png;base64,${base64Image}`;
  } catch (err) {
    console.log(err);
  }
  return <img src={imageContent} width={width} height={height} />;
}
```

```js
function Post() {
  return (
    <div>
      <h2>
        <a href={`/${slug}`}>{slug}</a>
      </h2>
      <Markdown components={{ img: Image }}>{content}</Markdown>
    </div>
  );
}
```
