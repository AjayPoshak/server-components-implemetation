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

function uncompactJSX(jsx) {
  function helper(input) {
    if (input.length === 0) return null;
    const obj = {};
    obj["$$typeof"] = input[0];
    obj.type = input[1];
    obj.props = input[2] || {};
    obj.key = null;
    obj.ref = null;
    if (obj.props?.children && Array.isArray(obj.props?.children)) {
      const childElements = obj.props.children;
      const newChildren = childElements.map((child) => helper(child));
      obj.props = { ...obj.props, children: newChildren };
    }
    return obj;
  }
  return helper(jsx);
}

async function fetchClientJSX(pathname) {
  const response = await fetch(pathname + "?jsx=true");
  const fetchedJSX = await response.text();
  const jsx = JSON.parse(fetchedJSX, parseJSX);
  const uncompressedJSX = uncompactJSX(jsx);
  return uncompressedJSX;
}

async function navigate(href) {
  const clientJSX = await fetchClientJSX(href);
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
    if (!href.startsWith("/")) return;
    if (event.target.tagName === "A") {
      event.preventDefault();
      window.history.pushState(null, null, href);
      navigate(href);
    }
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
