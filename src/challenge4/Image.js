import { readFile } from "node:fs/promises";
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
