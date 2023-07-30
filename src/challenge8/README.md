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
ffunction compactJSX(json) {
  function helper(input) {
    if (!input) return [null, null, null];
    const arr = [];
    const { type, props } = input;
    arr.push(input["$$typeof"] || null);
    arr.push(type || null);
    if (props && Object.keys(props).length > 0) {
      const obj = {};
      const keys = Object.keys(props);
      keys.forEach((key) => {
        if (key === "children") {
          if (Array.isArray(props.children)) {
            obj[key] = props.children.map((childComponent) =>
              helper(childComponent)
            );
          } else {
            obj[key] = props[key];
          }
        } else {
          obj[key] = props[key];
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

On client side also, after fetching the compressed JSX, we need to uncompress it before passing it to react.

`client.js`

```js
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
```

After above compression, our JSX size for `/hello` route came down from `5.8KB` to `1.2KB`, almost 80% reduction in size, unbelievable!

### Before

<img width="1042" alt="Screenshot 2023-07-30 at 11 19 06 AM" src="https://github.com/AjayPoshak/server-components-implemetation/assets/7375457/46c9cd92-3905-4818-a225-f814d44a5fc9">

### After
<img width="1097" alt="Screenshot 2023-07-30 at 11 12 00 AM" src="https://github.com/AjayPoshak/server-components-implemetation/assets/7375457/87e93cca-d487-4f11-99a2-a26696beca47">
