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
  return (
    <html>
      <head>My Blog</head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  );
}
