## Challenge 6

Pressing the Back button currently always refetches fresh JSX. Change the logic in `client.js` so that Back/Forward navigation reuses previously cached responses, but clicking a link always fetches a fresh response. This would ensure that pressing Back and Forward always feels instant, similar to how the browser treats full-page navigations.

### Solution

Pressing back/forward button should always fetch JSX from local cache. For our purpose, lets store the fetched JSX in `localStorage` and when back button is pressed we fetch from localstorage.

To listen to back/forward button clicks, we already have implemented the listener for `popstate`, we just need to add caching logic here.

`client.js`

```js
// Call custom logic when browser back button is pressed
window.addEventListener("popstate", () => {
  const nextPageJSX = readFromStorage(window.location.pathname); // Check if we already have the JSX in storage for this path
  if (nextPageJSX) {
    const parsedJSX = JSON.parse(nextPageJSX, parseJSX);
    navigate(window.location.pathname, parsedJSX);
  } else {
    navigate(window.location.pathname);
  }
});
```
