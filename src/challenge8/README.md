## Challenge 8

The format to which we serialize JSX is currently very repetitive. Do you have any ideas on how to make it more compact? You can check a production-ready RSC framework like Next.js App Router, or our (official non-framework RSC demo)[https://github.com/reactjs/server-components-demo] for inspiration. Even without implementing streaming, it would be nice to at least represent the JSX elements in a more compact way.

### Solution

Currently the JSX JSON generated from server looks like this.

```json
{
  "$$typeof": "$RE",
  "type": "html",
  "key": null,
  "ref": null,
  "props": {
    "children": [
      {
        "$$typeof": "$RE",
        "type": "body",
        "key": null,
        "ref": null,
        "props": {
          "children": [
            {
              "$$typeof": "$RE",
              "type": "nav",
              "key": null,
              "ref": null,
              "props": {
                "children": [
                  {
                    "$$typeof": "$RE",
                    "type": "input",
                    "key": null,
                    "ref": null,
                    "props": {
                      "type": "text"
                    },
                    "_owner": null,
                    "_store": {}
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

As you can see there are many fields whose values are just either `null` or `{}`. So one way is to remove these fields from generated JSON unless they have values other than the default. Then we only keep the fields which has value. For example, above JSON will look like this.

```json
{
  "$$typeof": "$RE",
  "type": "html",
  "props": {
    "children": [
      {
        "$$typeof": "$RE",
        "type": "body",
        "props": {
          "children": [
            {
              "$$typeof": "$RE",
              "type": "nav",
              "props": {
                "children": [
                  {
                    "$$typeof": "$RE",
                    "type": "input",
                    "props": {
                      "type": "text"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

We have managed to reduce the keys from 27 to 19, that's 30% reduction in key count. Can we do better?

```js
function countKeys(json) {
  let count = 0;
  function helper(json) {
    if (!json) return;
    if (Array.isArray(json)) {
      count += 1;
      json.forEach((item) => helper(item));
      return;
    }
    // Now its object
    const keys = Object.keys(json);
    count += keys.length;
    for (let [key, value] of Object.entries(json)) {
      if (Array.isArray(value) || typeof value === "object") helper(value);
    }
  }
  helper(json);
  return count;
}
```

What if we can remove keys entirely? In other words, instead of this being an object, we make it an array of values. For example, `{"name": "Alpha", "lastName": "Beta"}` can be transformed into `["Alpha", "Beta"]`. One downside of this approach is that the deserializer should know which position corresponds to which key otherwise it won't be able to re-construct the serialized object.

In our case, it could be like this

```json
[
  "$RE",
  "html",
  [
    {
      "children": [
        [
          "$RE",
          "body",
          {
            "children": [
              [
                "$RE",
                "nav",
                {
                  "children": [
                    ["$RE", "input", { "children": [null, "text", null] }]
                  ]
                }
              ]
            ]
          }
        ]
      ]
    }
  ]
]
```

```js
function compactJSON(json) {
  function helper(input) {
    if (!input) return [null, null, null];
    const arr = [];
    arr.push(json["$$typeof"] || null);
    arr.push(json.type || null);
    if (json.props && Object.keys(json.props).length > 0) {
      const obj = {};
      const keys = Object.keys(json.props);
      keys.forEach((key) => {
        if (key === "children") {
          const childrenComponents = json.props.children;
          obj[key] = childrenComponents.map((childComponent) =>
            helper(childComponent)
          );
        } else {
          obj[key] = json.props[key];
        }
      });
      arr.push(obj);
    } else {
      arr.push(null);
    }
    return arr;
  }
  return helper(json);
}
```
