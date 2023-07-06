export function HomeIndex({ slugs = [], contents = [] }) {
  return (
    <section>
      <ul>
        {slugs.map((slug, index) => (
          <li>
            <h2>
              <a href={`/${slug}`}>{slug}</a>
            </h2>
            <article>{contents[index]}</article>
          </li>
        ))}
      </ul>
    </section>
  );
}
