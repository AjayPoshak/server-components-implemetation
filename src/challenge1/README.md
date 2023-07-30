## Challenge1

Add a random background color to the <body> of the page, and add a transition on the background color. When you navigate between the pages, you should see the background color animating.

### Solution

First of all, we need to generate a random background color, and attach it to body of the page.

```js
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
```

`transition` property in CSS can be used to animate the changing background color. Its syntax is as follows:

```
  transition: <transition-property> <transition-duration> <easing-function>;
```

There are many more variations of this syntax, for more details check [here](https://developer.mozilla.org/en-US/docs/Web/CSS/transition).

In our example, we don't have the support to server CSS files yet. So in `ssr.js` we'll just insert a `style` tag to add `transition` property.

`ssr.js`

```js
html += `<style> body { transition: background-color 300ms linear; } </style>`;
```
