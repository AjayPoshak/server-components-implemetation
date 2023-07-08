import escapeHTML from "escape-html";

function Footer({ author }) {
  return (
    <footer>
      <hr />
      <p>
        <i>
          (c) {escapeHTML(author)}, {new Date().getFullYear()}
        </i>
      </p>
    </footer>
  );
}

export function BlogLayoutPage({ children, author }) {
  function generateRandomBgColor() {
    // we need to generate six hex code chars
    const hexCodes = ["a", "b", "c", "d", "e", "f"];
    const color = [];
    for (let i = 0; i < 6; i++) {
      const random = Math.floor((Math.random() * 100) % 16);
      if (random <= 9) {
        color.push(random);
      } else {
        const hexChar = hexCodes[random - 10];
        color.push(hexChar);
      }
    }
    return `#${color.join("")}`;
  }
  return (
    <html>
      <head>My Blog</head>
      <body style={{ "background-color": generateRandomBgColor() }}>
        <nav>
          <input type="text"></input>
          <a href="/">Home</a>
          <hr />
        </nav>
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  );
}
