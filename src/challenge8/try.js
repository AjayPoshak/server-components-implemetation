function compactJSON(json) {
  function helper(input) {
    console.log(input);
    if (!input) return [null, null, null];
    const arr = [];
    arr.push(input["$$typeof"] || null);
    arr.push(input.type || null);
    if (input.props && Object.keys(input.props).length > 0) {
      const obj = {};
      const keys = Object.keys(input.props);
      keys.forEach((key) => {
        if (key === "children") {
          const childrenComponents = input.props.children;
          obj[key] = childrenComponents.map((childComponent) => {
            console.log({ childComponent });
            return helper(childComponent);
          });
        } else {
          obj[key] = input.props[key];
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

const json = {
  $$typeof: "$RE",
  type: "html",
  props: {
    children: [
      {
        $$typeof: "$RE",
        type: "body",
        props: {
          children: [
            {
              $$typeof: "$RE",
              type: "nav",
              props: {
                children: [
                  {
                    $$typeof: "$RE",
                    type: "input",
                    props: {
                      type: "text",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

compactJSON(json);
