import { hydrateRoot } from "react-dom/client";

function getInitialClientJSX() {
  const jsxString = window.__INITIAL_CLIENT_JSX_STRING__;
  const jsx = JSON.parse(jsxString, parseJSX);
  return jsx;
}

const root = hydrateRoot(document, getInitialClientJSX());

function parseJSX(key, value) {
  if (value === "$RE") {
    return Symbol.for("react.element");
  }
  return value;
}

async function fetchClientJSX(pathname, method, payload) {
  const url = pathname + "?jsx=true";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: method.toUpperCase() === "POST" && payload ? payload : null,
  });
  const fetchedJSX = await response.text();
  return JSON.parse(fetchedJSX, parseJSX);
}

async function navigate(href, method = "GET", payload = {}) {
  const clientJSX = await fetchClientJSX(href, method, payload);
  root.render(clientJSX);
}

window.addEventListener(
  "click",
  (event) => {
    // Ignore open in new tab
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const href = event.target.getAttribute("href");
    // Nothing for external URLs
    if (href && !href.startsWith("/")) return;
    if (href && event.target.tagName === "A") {
      event.preventDefault();
      window.history.pushState(null, null, href);
      navigate(href);
    }
  },
  true
);

window.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let payload = "";
    for (let [key, value] of formData) {
      payload += key;
      payload += "=";
      payload += value;
    }
    const { action: requestURL, method } = event.target;
    navigate(requestURL, method, payload);
    return false;
  },
  true
);
// We are setting `capture` to true to catch the event in `capture` phase ie. stop it at window level and prevent it from coming down.
// Reasone for doing this is simple, if catch the event in `bubble` phase, then it allows other events below window to intercept it,
// and once intercepted, those elements can prevent it from bubbling up.

// Call custom logic when browser back button is pressed
window.addEventListener("popstate", () => {
  navigate(window.location.pathname);
});

// window.addEventListener("load", () => {
// const forms = document.getElementsByTagName("form");
// for (const form of forms) {
//   form.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(form);
//     let payload = "";
//     for (let [key, value] of formData) {
//       payload += key;
//       payload += "=";
//       payload += value;
//     }
//     const { action: requestURL, method } = event.target;
//     navigate(requestURL, method, payload);
//     return false;
//   });
// }
// // });
